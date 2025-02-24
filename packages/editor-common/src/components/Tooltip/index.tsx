import type { Placement } from '@floating-ui/react'; // 样式文件，后面会提供
import {
  FloatingPortal,
  autoUpdate,
  flip,
  offset,
  shift,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
  useRole,
} from '@floating-ui/react';
import React, { useRef, useState } from 'react';
import './index.scss';

const NewTooltip = ({ children, content, placement = 'top' as Placement }) => {
  const [isOpen, setIsOpen] = useState(false);
  const arrowRef = useRef(null);

  // 使用 floating-ui 的核心钩子
  const { x, y, strategy, refs, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement, // 默认位置，比如 'top', 'bottom', 'left', 'right'
    middleware: [
      offset(6), // 距离触发元素的偏移量
      flip(), // 自动翻转以避免超出视口
      shift(), // 防止溢出边界
    ],
    whileElementsMounted: autoUpdate, // 动态更新位置
  });

  // 交互行为
  const hover = useHover(context, { move: false });
  const focus = useFocus(context);
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: 'tooltip' });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    hover,
    focus,
    dismiss,
    role,
  ]);

  const getToolTipTitle = (tooltip: string) => {
    if (tooltip) {
      const regex = /\((.*?)\)/; // 匹配括号及其内容
      const result = tooltip.split(regex);
      return (
        <div style={{ textAlign: 'center' }}>
          <div className="text">{result[0]}</div>
          <div
            className="keyboard"
            style={{ color: '#ffffff', opacity: '0.7' }}
          >
            {result[1]}
          </div>
        </div>
      );
    }
    return null;
  };
  const title = getToolTipTitle(content);

  return (
    <>
      {/* 触发元素 */}
      <span
        ref={refs.setReference}
        {...getReferenceProps()}
        style={{ display: 'inline-block' }}
      >
        {children}
      </span>

      {/* 提示内容 */}
      {isOpen && (
        <FloatingPortal>
          <div
            ref={refs.setFloating}
            style={{
              position: strategy,
              top: y ?? 0,
              left: x ?? 0,
              zIndex: 1000,
            }}
            {...getFloatingProps()}
            className="tooltip"
          >
            {title}
          </div>
        </FloatingPortal>
      )}
    </>
  );
};

export default NewTooltip;
