import type {FC, ReactNode} from 'react';
import {autoUpdate, offset, useClick, useDismiss, useFloating, useInteractions, useRole,} from '@floating-ui/react';
import {AnimatePresence, motion} from 'framer-motion';
import {createPortal} from 'react-dom';
import Button from '../Button';
import Iconfont from '../IconFont';
import cx from 'classnames';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  onSubmit?: () => void;
  title?: ReactNode;
  wrapperClassName?: string;
}

const Modal: FC<ModalProps> = ({
  onSubmit,
  title,
  open,
  onClose,
  children,
  wrapperClassName,
}) => {
  // 处理 Floating UI 定位
  const { refs, context } = useFloating({
    open,
    onOpenChange: state => !state && onClose(),
    middleware: [offset(10)],
    whileElementsMounted: autoUpdate,
  });

  // 交互管理（点击外部关闭、Esc 关闭）
  const click = useClick(context);
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: 'dialog' });
  const { getFloatingProps } = useInteractions([click, dismiss, role]);

  // 如果 Modal 关闭，不渲染任何内容
  if (!open) return null;

  return createPortal(
    <AnimatePresence>
      <div className={cx('textory-modal', wrapperClassName)}>
        <motion.div
          className="textory-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* 蒙层，点击时关闭 Modal */}
          <motion.div
            className="textory-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal 弹窗 */}
          <motion.div
            ref={refs.setFloating}
            {...getFloatingProps()}
            className="textory-modal-container"
            onClick={e => e.stopPropagation()} // 阻止冒泡，避免点击 Modal 内部时关闭
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            <Iconfont
              type="icon-close"
              className="textory-modal-close"
              onClick={onClose}
            />
            <div className="textory-modal-header">{title}</div>
            <div className="textory-modal-body">{children}</div>
            <div className="textory-modal-footer">
              <Button type="primary" onClick={onSubmit}>
                确认
              </Button>
              <Button onClick={onClose}>取消</Button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body,
  );
};

export default Modal;
