import {Iconfont} from '@textory/editor-common';
import type {Editor} from '@tiptap/core';
import {type FC, useCallback} from 'react';
import {useEditorState} from '@tiptap/react';
import cx from 'classnames';

export interface BubbleButtonProps {
  editor: Editor;
  /** 用于 isActive 订阅的 mark 名；不传则按 onClick 控制。 */
  mark?: string;
  /** 自定义点击；不传则默认 toggle mark。 */
  onClick?: () => void;
  /** iconfont type，不含 `icon-` 前缀也可。 */
  icon: string;
  /** 鼠标 hover 提示。 */
  tooltip?: string;
  /** 强制禁用。 */
  disabled?: boolean;
}

const normalizeIcon = (icon: string) =>
  icon.startsWith('icon-') ? icon : `icon-${icon}`;

/**
 * Bubble 工具栏里的通用按钮。
 *
 * 性能：每个按钮独立 `useEditorState`，selector 只返回 boolean，Tiptap
 * deep-compare 跳过未变状态，避免选区变化引起整组按钮重渲染。
 */
const BubbleButton: FC<BubbleButtonProps> = ({
  editor,
  mark,
  onClick,
  icon,
  tooltip,
  disabled,
}) => {
  const {active} = useEditorState({
    editor,
    selector: ({editor}) => ({
      active: mark ? editor.isActive(mark) : false,
    }),
  });
  const handleClick = useCallback(() => {
    if (disabled) return;
    if (onClick) return onClick();
    if (mark) editor.chain().focus().toggleMark(mark).run();
  }, [disabled, onClick, editor, mark]);
  return (
    <button
      type="button"
      className={cx('textory-text-bubble__btn', {
        'is-active': active,
      })}
      onClick={handleClick}
      disabled={disabled}
      title={tooltip}
    >
      <Iconfont type={normalizeIcon(icon)} />
    </button>
  );
};

export default BubbleButton;
