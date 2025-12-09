import {
  arrow,
  autoUpdate,
  flip,
  FloatingArrow,
  FloatingPortal,
  offset,
  type Placement,
  safePolygon,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useHover,
  useInteractions,
  useRole,
  useTransitionStyles,
} from '@floating-ui/react';
import type {MutableRefObject, PropsWithChildren, ReactNode} from 'react';
import {forwardRef, useImperativeHandle, useMemo, useRef} from 'react';
import useControlledValue from '../../hooks/useControlledValue.ts'; // 自定义箭头组件

// 自定义箭头组件
interface ArrowProps {
  ref?: MutableRefObject<null>;
}

export interface TPopoverProps extends PropsWithChildren {
  children: ReactNode;
  content: ReactNode;
  placement?: Placement;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  triggerAction?: 'click' | 'hover';
  className?: string;
}

const Popover = forwardRef<any, TPopoverProps>((props, ref) => {
  const {
    onOpenChange,
    children,
    content,
    placement = 'bottom' as Placement,
    open,
    triggerAction = 'click',
  } = props;
  const [isOpen, setIsOpen] = useControlledValue<boolean>({
    value: open,
    defaultValue: false,
    onChange: onOpenChange,
  });
  // const [isOpen, setIsOpen] = useState(false);
  const arrowRef = useRef(null);
  const popoverRef = useRef(null);

  const {
    x,
    y,
    strategy,
    refs,
    context,
    placement: actualPlacement,
    update,
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
  const hover = useHover(context, {
    handleClose: safePolygon(),
  });

  const dismiss = useDismiss(context, {
    outsidePress: true, // 点击外部关闭
    escapeKey: true, // 按 Esc 键关闭
  });
  const role = useRole(context, { role: 'dialog' });
  const interactionArray = useMemo(() => {
    const res = [dismiss, role];
    if (triggerAction === 'click') {
      res.push(click);
    } else {
      res.push(hover);
    }
    return res;
  }, [triggerAction]);
  const { getReferenceProps, getFloatingProps } =
    useInteractions(interactionArray);

  const { isMounted, styles } = useTransitionStyles(context, {
    duration: 200,
    initial: { opacity: 0, transform: 'scale(0.95)' },
    open: { opacity: 1, transform: 'scale(1)' },
    close: { opacity: 0, transform: 'scale(0.95)' },
  });
  const { x: arrowX, y: arrowY } = context.middlewareData.arrow || {};
  useImperativeHandle(ref, () => {
    return {
      update,
    };
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
            ref={node => {
              refs.setFloating(node);
              popoverRef.current = node;
            }}
            className="easy-editor-popover-container"
            {...getFloatingProps()}
            style={{ ...styles, position: strategy, top: y ?? 0, left: x ?? 0 }}
          >
            {content}
            <FloatingArrow
              ref={arrowRef}
              context={context}
              fill="#fff"
              stroke="#e5e7eb"
              strokeWidth={1}
              width={10} // 设置箭头宽度
              height={5} // 设置箭头高度
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
});

export default Popover;
