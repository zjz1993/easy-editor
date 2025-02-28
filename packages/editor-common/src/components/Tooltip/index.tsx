import {
  FloatingPortal,
  type Placement,
  arrow,
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
} from '@floating-ui/react'; // 样式文件，后面会提供
import React, { type FC, type ReactNode, useRef } from 'react';
import './index.scss';
import useControllableValue from '../../hooks/useControlledValue.ts';
import type { TPopoverProps } from '../Popover/index.tsx';

const NewTooltip: FC<TPopoverProps> = props => {
  const { children, content, placement = 'top' as Placement } = props;
  const [isOpen, setIsOpen] = useControllableValue<boolean>(props, {
    defaultValue: false,
    valuePropName: 'open',
  });
  const arrowRef = useRef(null);
  console.log('props中的open是', props.open, isOpen);

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
      console.log('onOpenChange触发', tempOpen);
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

  // 计算箭头位置
  const staticSide = {
    top: 'bottom',
    right: 'left',
    bottom: 'top',
    left: 'right',
  }[placement.split('-')[0]];

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
            className="tooltip-container"
            data-placement={placement}
          >
            {title}
            {/*<FloatingArrow*/}
            {/*  ref={arrowRef}*/}
            {/*  context={context}*/}
            {/*  className="tooltip-arrow"*/}
            {/*  style={{*/}
            {/*    position: 'absolute',*/}
            {/*    left: x != null ? `${x}px` : '',*/}
            {/*    top: y != null ? `${y}px` : '',*/}
            {/*    [staticSide]: '-6px', // 调整箭头与 tooltip 的距离*/}
            {/*    width: '12px',*/}
            {/*    height: '12px',*/}
            {/*    background: '#333',*/}
            {/*    transform: 'rotate(45deg)',*/}
            {/*    zIndex: -1, // 确保箭头在 tooltip 下方*/}
            {/*  }}*/}
            {/*/>*/}
          </div>
        </FloatingPortal>
      )}
    </>
  );
};

export default NewTooltip;
