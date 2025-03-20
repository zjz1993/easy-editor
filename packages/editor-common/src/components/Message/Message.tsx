import {
  autoUpdate,
  flip,
  offset,
  shift,
  useFloating,
} from '@floating-ui/react';
import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

interface MessageItem {
  id: number;
  type: 'success' | 'error' | 'info';
  content: string;
}

interface MessageProps {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: (id: number) => void;
}

const Message: React.FC<MessageProps> = ({ id, message, type, onClose }) => {
  const { x, y, refs, strategy } = useFloating({
    placement: 'top',
    middleware: [offset(10), flip(), shift()],
    whileElementsMounted: autoUpdate,
  });

  useEffect(() => {
    const timer = setTimeout(() => onClose(id), 3000);
    return () => clearTimeout(timer);
  }, [id, onClose]);

  const colors = {
    success: '#52c41a',
    error: '#ff4d4f',
    info: '#1890ff',
  };

  return (
    <div
      ref={refs.setFloating}
      style={{
        position: strategy,
        top: y ?? 0,
        left: x ?? 0,
        padding: '8px 16px',
        backgroundColor: colors[type],
        color: '#fff',
        borderRadius: '6px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
        opacity: 1,
        transition: 'opacity 0.3s',
        marginBottom: '8px',
      }}
    >
      {message}
    </div>
  );
};

const MessageContainer = () => {
  const [messages, setMessages] = useState<MessageItem[]>([]);

  const addMessage = (type: MessageItem['type'], content: string) => {
    setMessages(prev => [...prev, { id: Date.now(), type, content }]);
  };

  const removeMessage = (id: number) => {
    setMessages(prev => prev.filter(msg => msg.id !== id));
  };

  useEffect(() => {
    (window as any).messageApi = {
      success: (msg: string) => addMessage('success', msg),
      error: (msg: string) => addMessage('error', msg),
      info: (msg: string) => addMessage('info', msg),
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
      }}
    >
      {messages.map(({ id, type, content }) => (
        <Message
          key={id}
          id={id}
          message={content}
          type={type}
          onClose={removeMessage}
        />
      ))}
    </div>,
    document.body,
  );
};

export const message = {
  success: (msg: string) => (window as any).messageApi?.success(msg),
  error: (msg: string) => (window as any).messageApi?.error(msg),
  info: (msg: string) => (window as any).messageApi?.info(msg),
};

export default MessageContainer;
