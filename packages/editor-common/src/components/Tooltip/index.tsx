import {
  arrow,
  autoUpdate,
  flip,
  FloatingArrow,
  FloatingPortal,
  offset,
  type Placement,
  shift,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
  useRole,
} from '@floating-ui/react'; // 样式文件，后面会提供
import React, {type FC, type ReactNode, useRef} from 'react';
import './index.scss';
import useControlledValue from '../../hooks/useControlledValue.ts';
import type {TPopoverProps} from '../Popover/index.tsx';

const NewTooltip: FC<TPopoverProps> = props => {
  const { open, children, content, placement = 'top' as Placement } = props;
  const [isOpen, setIsOpen] = useControlledValue<boolean>({
    value: open,
    defaultValue: false,
    // onChange: onOpenChange,
  });
  const arrowRef = useRef(null);

  // 使用 floating-ui 的核心钩子
  const {
    x,
    y,
    strategy,
    refs,
    middlewareData,
    context,
    placement: actualPlacement,
  } = useFloating({
    open: isOpen,
    onOpenChange: tempOpen => {
      setIsOpen(tempOpen);
    },
    placement,
    middleware: [
      offset(8), // 调整基础偏移量
      flip(),
      shift(),
      arrow({
        element: arrowRef,
        padding: 4, // 箭头与边缘的最小间距
      }),
    ],
    whileElementsMounted: autoUpdate,
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

  const getToolTipTitle = (tooltip: ReactNode) => {
    if (tooltip) {
      if (typeof tooltip === 'string') {
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
      return tooltip;
    }
    return null;
  };
  const title = getToolTipTitle(content);

  const { x: arrowX, y: arrowY } = context.middlewareData.arrow || {};
  return (
    <>
      {/* 触发元素 */}
      <div ref={refs.setReference} {...getReferenceProps()}>
        {children}
      </div>

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
            className="easy-editor-tooltip"
            data-placement={placement}
          >
            {title}
            <FloatingArrow
              ref={arrowRef}
              context={context}
              fill="#000"
              style={{
                position: 'absolute',
                left: arrowX != null ? `${arrowX}px` : '',
                top: arrowY != null ? `${arrowY}px` : '',
              }}
            />
          </div>
        </FloatingPortal>
      )}
    </>
  );
};

export default NewTooltip;
