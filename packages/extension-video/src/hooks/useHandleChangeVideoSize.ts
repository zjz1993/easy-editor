import type {MutableRefObject} from 'react';
import {useRef, useState} from 'react';

/**
 * Resize hook for video nodes. Mirrors `useHandleChangeImageSize`
 * — same corner-drag math, same min-size clamp, same ratio lock.
 * Lifted into its own module so `VideoView` can stay focused on
 * rendering. If a fourth caller appears, lift this into
 * `@textory/extension-upload` or `@textory/editor-common`.
 */
function useHandleChangeVideoSize(props: {
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
    const startWidth = size.width || containerRef.current?.offsetWidth || 0;
    const startHeight = size.height || containerRef.current?.offsetHeight || 0;

    const handleMouseMove = moveEvent => {
      if (!isResizing.current) return;

      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;

      let newWidth = startWidth;
      let newHeight = startHeight;

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

      newWidth = Math.max(120, newWidth);
      newHeight = Math.max(80, newHeight);
      const obj = {
        width: newWidth,
        height: ratio ? newWidth / ratio : newHeight,
      };
      setSize(obj);
      sizeCache.current = obj;
    };

    const handleMouseUp = () => {
      isResizing.current = false;
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
export default useHandleChangeVideoSize;
