import {autoUpdate, flip, offset, shift, useFloating,} from '@floating-ui/react';
import type {FC} from 'react';
import {useEffect, useState} from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import cx from 'classnames';
import Iconfont from '../IconFont';

type MessageType = 'success' | 'warning' | 'error' | 'info';

interface MessageItem {
  id: number;
  type: MessageType;
  content: string;
  onClose?: () => void;
}

interface MessageProps {
  id: number;
  message: string;
  type: MessageType;
  onClose: (id: number) => void;
  delay: number;
}

const Message: FC<MessageProps> = ({ delay, id, message, type, onClose }) => {
  const { x, y, refs, strategy } = useFloating({
    placement: 'top',
    middleware: [offset(10), flip(), shift()],
    whileElementsMounted: autoUpdate,
  });

  useEffect(() => {
    const timer = setTimeout(() => onClose(id), delay);
    return () => clearTimeout(timer);
  }, [id, onClose, delay]);

  const colors = {
    success: (
      <Iconfont type="icon-checked" className="easy-editor-message__icon" />
    ),
    error: (
      <Iconfont
        type="icon-close-circle-fill"
        className="easy-editor-message__icon"
      />
    ),
    info: (
      <Iconfont
        type="icon-info-circle-fill"
        className="easy-editor-message__icon"
      />
    ),
    warning: (
      <Iconfont
        type="icon-warning-circle-fill"
        className="easy-editor-message__icon"
      />
    ),
  };

  return (
    <div
      ref={refs.setFloating}
      className={cx('easy-editor-message', `easy-editor-message-${type}`)}
      style={{
        // position: strategy,
        top: y ?? 0,
        left: x ?? 0,
      }}
    >
      <div className="easy-editor-message__inner">
        {colors[type]}
        <span>{message}</span>
      </div>
    </div>
  );
};

const MessageContainer = () => {
  const [messages, setMessages] = useState<MessageItem[]>([]);

  const addMessage = (
    type: MessageItem['type'],
    content: string,
    onClose?: () => void,
  ) => {
    setMessages(prev => [...prev, { id: Date.now(), type, content, onClose }]);
  };

  const removeMessage = (id: number) => {
    setMessages(prev => prev.filter(msg => msg.id !== id));
  };

  useEffect(() => {
    (window as any).messageApi = {
      success: (msg: string, onClose?: () => void) =>
        addMessage('success', msg, onClose),
      error: (msg: string, onClose?: () => void) =>
        addMessage('error', msg, onClose),
      info: (msg: string, onClose?: () => void) =>
        addMessage('info', msg, onClose),
      warning: (msg: string, onClose?: () => void) =>
        addMessage('warning', msg, onClose),
    };
  }, []);

  return ReactDOM.createPortal(
    <div
      style={{
        position: 'fixed',
        top: 20,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9999,
        gap: 10,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {messages.map(({ id, type, content, onClose }, index) => (
        <Message
          key={id}
          id={id}
          message={content}
          type={type}
          delay={1000 + index * 500}
          onClose={() => {
            removeMessage(id);
            onClose?.();
          }}
        />
      ))}
    </div>,
    document.body,
  );
};

export const message = {
  success: (msg: string, onClose?: () => void) =>
    (window as any).messageApi?.success(msg, onClose),
  error: (msg: string, onClose?: () => void) =>
    (window as any).messageApi?.error(msg, onClose),
  info: (msg: string, onClose?: () => void) =>
    (window as any).messageApi?.info(msg, onClose),
  warning: (msg: string, onClose?: () => void) =>
    (window as any).messageApi?.warning(msg, onClose),
};

export default MessageContainer;
