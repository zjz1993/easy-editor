import type {MutableRefObject} from 'react';
import {useRef, useState} from 'react';

function useHandleChangeImageSize(props: {
  initWidth: number;
  initHeight: number;
  containerRef: MutableRefObject<HTMLElement>;
  onResizeEnd: (data: { width: number; height: number }) => void;
  ratio?: number;
}) {
  const { containerRef, onResizeEnd, initHeight, initWidth, ratio } = props;
  const sizeCache = useRef<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });
  const [size, setSize] = useState({ width: initWidth, height: initHeight });
  const isResizing = useRef(false);
  const handleMouseDown = (e, corner) => {
    e.preventDefault();
    isResizing.current = true;

    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = size.width;
    const startHeight = size.height || containerRef.current.offsetHeight;

    const handleMouseMove = moveEvent => {
      if (!isResizing.current) return;

      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;

      let newWidth = startWidth;
      let newHeight = startHeight;

      // 根据拖动的角计算新的尺寸
      switch (corner) {
        case 'bottom-right':
          newWidth = startWidth + deltaX;
          newHeight = startHeight + deltaY;
          break;
        case 'bottom-left':
          newWidth = startWidth - deltaX;
          newHeight = startHeight + deltaY;
          break;
        case 'top-right':
          newWidth = startWidth + deltaX;
          newHeight = startHeight - deltaY;
          break;
        case 'top-left':
          newWidth = startWidth - deltaX;
          newHeight = startHeight - deltaY;
          break;
      }

      // 设置最小尺寸限制
      newWidth = Math.max(50, newWidth);
      newHeight = Math.max(50, newHeight);
      const obj = {
        width: newWidth,
        height: ratio ? newWidth / ratio : newHeight, // 拖动时保持宽高比
      };
      setSize(obj);
      sizeCache.current = obj;
    };

    const handleMouseUp = () => {
      isResizing.current = false;
      // 更新 TipTap 节点的属性
      setSize({
        width: sizeCache.current.width,
        height: sizeCache.current.height,
      });
      onResizeEnd({
        width: sizeCache.current.width,
        height: sizeCache.current.height,
      });
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };
  const changeSize = (width: number, height: number) => {
    setSize({ width, height });
  };
  return { handleMouseDown, size, changeSize };
}
export default useHandleChangeImageSize;
