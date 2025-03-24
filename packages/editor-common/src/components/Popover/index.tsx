import {
  FloatingPortal,
  type Placement,
  arrow,
  autoUpdate,
  flip,
  offset,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useRole,
  useTransitionStyles,
} from '@floating-ui/react';
import type React from 'react';
import { useRef } from 'react';
import './index.scss';
import useControlledValue from '../../hooks/useControlledValue.ts';

// 自定义箭头组件
interface ArrowProps {
  ref?: React.MutableRefObject<null>;
}

export type TPopoverProps = {
  children: React.ReactNode;
  content: React.ReactNode;
  placement?: Placement;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

const Popover = (props: TPopoverProps) => {
  const {
    onOpenChange,
    children,
    content,
    placement = 'bottom' as Placement,
    open,
  } = props;
  const [isOpen, setIsOpen] = useControlledValue<boolean>({
    value: open,
    defaultValue: false,
    onChange: onOpenChange,
  });
  // const [isOpen, setIsOpen] = useState(false);
  const arrowRef = useRef(null);

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
      onOpenChange?.(tempOpen);
    },
    placement,
    middleware: [
      offset(8),
      flip(),
      shift({ padding: 5 }), // 边界留白
      arrow({ element: arrowRef }),
    ],
    whileElementsMounted: autoUpdate,
  });

  // 交互方式
  const click = useClick(context);
  const dismiss = useDismiss(context, {
    outsidePress: true, // 点击外部关闭
    escapeKey: true, // 按 Esc 键关闭
  });
  const role = useRole(context, { role: 'dialog' });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
    role,
  ]);

  const { isMounted, styles } = useTransitionStyles(context, {
    duration: 200,
    initial: { opacity: 0, transform: 'scale(0.95)' },
    open: { opacity: 1, transform: 'scale(1)' },
    close: { opacity: 0, transform: 'scale(0.95)' },
  });

  return (
    <>
      {/* 触发元素 */}
      <div ref={refs.setReference} {...getReferenceProps()}>
        {children}
      </div>

      {/* Popover 内容 */}
      {isOpen && (
        <FloatingPortal>
          <div
            ref={refs.setFloating}
            className="popover-container"
            {...getFloatingProps()}
            style={{ ...styles, position: strategy, top: y ?? 0, left: x ?? 0 }}
          >
            {content}
          </div>
        </FloatingPortal>
      )}
    </>
  );
};

export default Popover;
