import {
  BLOCK_TYPES,
  Iconfont,
  IntlComponent,
  MARK_TYPES,
  Tooltip,
  useDebounceFn,
  useEventListener,
} from '@textory/editor-common';
import {useCallback, useRef, useState} from 'react';
import {autoUpdate, flip, offset, shift, useFloating} from "@floating-ui/react";
import {LinkPanelPopup} from "@textory/editor-toolbar";

const LinkToolbar = ({
  from,
  to,
  text,
  href,
  editor,
  referenceEl,
  onClose,
}) => {
  const closeTimerRef = useRef<number | null>(null);
  const isClosedRef = useRef(false);
  const [showToolbar, setShowToolbar] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const { refs, floatingStyles } = useFloating({
    //placement: 'bottom-start',
    middleware: [offset(8), shift(), flip()],
    whileElementsMounted: autoUpdate,
    open: showToolbar,
    elements: {
      reference: referenceEl,
    },
  });

  const handleUpdate = (params: { text: string; href: string }) => {
    const { text, href } = params;

    editor
      .chain()
      .focus()
      // 1. 删除旧文本，避免遗留字符
      .deleteRange({ from, to: to + 1 })
      // 2. 插入带 link mark 的新文本
      .insertContentAt(from, [
        {
          type: BLOCK_TYPES.TEXT,
          text,
          marks: [{ type: MARK_TYPES.LK, attrs: { href } }],
        },
      ])
      .run();
    safeClose();
  };

  const handleDeleteLink = () => {
    editor.chain().focus().deleteRange({ from, to }).run();
    onClose();
  };

  const handleRemoveLink = () => {
    editor.chain().focus().unsetLink().run();
    onClose();
  };

  // 安全关闭函数，防止重复调用
  const safeClose = useCallback(() => {
    if (isClosedRef.current) return;
    isClosedRef.current = true;

    // 清理定时器
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }

    onClose?.();
  }, [onClose]);

  const { run } = useDebounceFn(
    () => {
      setShowToolbar(true);
    },
    {
      wait: 500,
    },
  );

  useEventListener(
    'mouseenter',
    () => {
      run();
    },
    { target: referenceEl },
  );

  useEventListener(
    'mouseleave',
    () => {
      setCloseTimer();
    },
    { target: referenceEl },
  );

  // 清除关闭定时器
  const clearCloseTimer = useCallback(() => {
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  // 设置关闭定时器
  const setCloseTimer = useCallback(() => {
    clearCloseTimer();
    closeTimerRef.current = window.setTimeout(() => {
      safeClose();
    }, 500);
  }, []);

  // 工具栏的鼠标进入事件
  const handleToolbarMouseEnter = useCallback(() => {
    clearCloseTimer();
    setShowToolbar(true);
  }, [clearCloseTimer]);

  // 工具栏的鼠标离开事件
  const handleToolbarMouseLeave = useCallback(() => {
    setCloseTimer();
  }, [setCloseTimer]);

  if (!showToolbar) {
    return null;
  }

  return (
    <div
      ref={refs.setFloating}
      style={{
        ...floatingStyles,
      }}
      className="textory-link-toolbar"
      onMouseEnter={handleToolbarMouseEnter}
      onMouseLeave={handleToolbarMouseLeave}
    >
      {showEditPopup ? (
        <LinkPanelPopup
          text={text}
          href={href}
          onCancel={() => {
            setShowEditPopup(false);
          }}
          onConfirm={({ text, href }) => {
            handleUpdate({ text, href });
          }}
        />
      ) : (
        <>
          <Tooltip content={IntlComponent.get('toolbar.link.edit')}>
            <Iconfont
              type="icon-edit"
              className="textory-link-toolbar-icon-edit"
              onClick={() => {
                setShowEditPopup(true);
              }}
            />
          </Tooltip>
          <Tooltip content={IntlComponent.get('toolbar.link.unlink')}>
            <Iconfont
              type="icon-unlink"
              className="textory-link-toolbar-icon-del"
              onClick={handleRemoveLink}
            />
          </Tooltip>
          <Tooltip content={IntlComponent.get('delete')}>
            <Iconfont
              type="icon-remove"
              className="textory-link-toolbar-icon-del"
              onClick={handleDeleteLink}
            />
          </Tooltip>
        </>
      )}
    </div>
  );
};
export default LinkToolbar;
