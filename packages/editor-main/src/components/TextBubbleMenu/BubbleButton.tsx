import {Iconfont, IntlComponent, Tooltip} from '@textory/editor-common';
import {isWindows} from '@textory/editor-utils';
import type {Editor} from '@tiptap/core';
import {type FC, useCallback} from 'react';
import {useEditorState} from '@tiptap/react';
import cx from 'classnames';

// 快捷键提示的修饰键文案，与 toolbar 的 ToolbarItemButtonWrapper 注入的变量一致
const command = isWindows() ? 'Ctrl' : '⌘';
const option = isWindows() ? 'Alt' : 'Option';

export interface BubbleButtonProps {
  id: string;
  editor: Editor;
  /** 用于 isActive 订阅的 mark 名；不传则按 onClick 控制。 */
  mark?: string;
  /** 自定义点击；不传则默认 toggle mark。 */
  onClick?: () => void;
  /** iconfont type，不含 `icon-` 前缀也可。 */
  icon: string;
  /**
   * 鼠标 hover 提示的 intl key（如 'bold'），内部解析并注入
   * {command} / {option} 快捷键变量。传已解析文案会导致二次
   * IntlComponent.get 查不到 key 而告警。
   */
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
  id
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
  const dom = (
    <button
      type="button"
      className={cx('textory-text-bubble__btn', {
        'is-active': active,
      })}
      onClick={handleClick}
      disabled={disabled}
    >
      <Iconfont type={normalizeIcon(icon)} />
    </button>
  );
  return (
    <Tooltip
      key={id}
      disabled={disabled || !tooltip}
      content={tooltip ? IntlComponent.get(tooltip, {command, option}) : undefined}
    >
      {dom}
    </Tooltip>
  );
};

export default BubbleButton;
