import {Iconfont, IntlComponent} from '@textory/editor-common';
import type {Editor} from '@tiptap/core';
import {type FC, useCallback, useEffect, useLayoutEffect, useRef, useState} from 'react';
import {useEditorState} from '@tiptap/react';
import cx from 'classnames';

export interface LinkButtonProps {
  editor: Editor;
}

/**
 * 文字气泡里的「插入链接」按钮。
 *
 * 点击展开 URL 输入浮层；提交时把当前 selection 整体加上 link mark，
 * 文字内容保持不变（即用户选中的文字）。
 *
 * 性能：独立 useEditorState 只返回 link 是否激活的 boolean，
 * 选区变化时不会触发其他按钮重渲染。
 */
const LinkButton: FC<LinkButtonProps> = ({editor}) => {
  const [open, setOpen] = useState(false);
  const [href, setHref] = useState('');
  const wrapperRef = useRef<HTMLSpanElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const {active} = useEditorState({
    editor,
    selector: ({editor}) => ({
      active: editor.isActive('link'),
    }),
  });

  // 打开时预填已有 href 并 focus 输入框
  useEffect(() => {
    if (!open) return;
    const attrs = editor.getAttributes('link');
    setHref(typeof attrs?.href === 'string' ? attrs.href : '');
    const raf = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(raf);
  }, [open, editor]);

  // 点击外部关闭浮层
  useLayoutEffect(() => {
    if (!open) return;
    const handle = (e: MouseEvent) => {
      const target = e.target;
      if (!(target instanceof Node)) return;
      if (
        wrapperRef.current?.contains(target) ||
        popoverRef.current?.contains(target)
      ) {
        return;
      }
      setOpen(false);
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [open]);

  const submit = useCallback(() => {
    const url = href.trim();
    if (!url) return;
    // 用 setMark 直接给当前 selection 整体加 link mark，
    // 不走 setLink 命令（该命令内部走 insertContent，要求 text 字段会替换文字）。
    editor
      .chain()
      .focus()
      .setMark('link', {href: url})
      .setMeta('preventAutolink', true)
      .run();
    setOpen(false);
  }, [href, editor]);

  return (
    <span ref={wrapperRef} className="textory-text-bubble__link">
      <button
        type="button"
        className={cx('textory-text-bubble__btn', {'is-active': active})}
        onClick={() => setOpen(v => !v)}
        title={IntlComponent.get('toolbar.link.set')}
      >
        <Iconfont type="icon-link" />
      </button>
      {open && (
        <div
          ref={popoverRef}
          className="textory-text-bubble__link-popover"
          onMouseDown={e => e.stopPropagation()}
        >
          <input
            ref={inputRef}
            className="textory-text-bubble__link-input"
            value={href}
            placeholder={IntlComponent.get('link.panel.href.label')}
            onChange={e => setHref(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                e.preventDefault();
                submit();
              } else if (e.key === 'Escape') {
                e.preventDefault();
                setOpen(false);
              }
            }}
          />
          <button
            type="button"
            className="textory-text-bubble__link-submit"
            onClick={submit}
          >
            {IntlComponent.get('common.confirm')}
          </button>
        </div>
      )}
    </span>
  );
};

export default LinkButton;
