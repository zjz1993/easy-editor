import {BLOCK_TYPES, BubbleMenu, IntlComponent} from '@textory/editor-common';
import type {Editor} from '@tiptap/core';
import {TextSelection} from '@tiptap/pm/state';
import {type FC, useCallback} from 'react';
import type {BubbleMenuProps} from '@tiptap/react/menus';
import BubbleButton from './BubbleButton';
import ColorDropdown from './ColorDropdown';
import FontSizeDropdown from './FontSizeDropdown';
import HeadingDropdown from './HeadingDropdown';
import LinkButton from './LinkButton';

export interface TextBubbleMenuProps {
  editor: Editor;
}

/**
 * 选中文字时弹出的浮动工具栏。
 *
 * shouldShow 显式排除:
 * - 表格 (TableBubbleMenu 接管)
 * - 代码块 / 图片 / 视频 / 文件
 * - drag-handle 正在拖动（拖动会创建非空的块级选区）
 * - 非 TextSelection（包括拖动产生的 NodeRangeSelection）
 *
 * 不要用 `if (isDragging) return null` 整体卸载组件 — BubbleMenu 内部
 * portal/element 生命周期由 tiptap plugin 管,React 卸载会与 plugin 同时
 * 操作 DOM,触发 NotFoundError: removeChild。
 */
export const TextBubbleMenu: FC<TextBubbleMenuProps> = ({editor}) => {
  const shouldShow = useCallback<BubbleMenuProps['shouldShow']>(props => {
    const {editor, from, to, state} = props;
    if (!editor.isEditable) return false;
    if (editor.isEmpty) return false;
    if (editor.view.dragging) return false;
    if (from === to) return false;
    if (!(state.selection instanceof TextSelection)) return false;
    if (editor.isActive(BLOCK_TYPES.VIDEO)) return false;
    if (editor.isActive(BLOCK_TYPES.CODE)) return false;
    if (editor.isActive(BLOCK_TYPES.TABLE)) return false;
    if (editor.isActive(BLOCK_TYPES.FILE)) return false;
    return !editor.isActive(BLOCK_TYPES.IMG);
  }, []);

  return (
    <BubbleMenu
      editor={editor}
      pluginKey="textBubbleMenu"
      shouldShow={shouldShow}
      className="textory-text-bubble"
      updateDelay={150}
    >
      <HeadingDropdown editor={editor} />
      <span className="textory-text-bubble__divider" />
      <BubbleButton editor={editor} mark="bold" icon="icon-bold" tooltip={IntlComponent.get('bold')} />
      <BubbleButton editor={editor} mark="italic" icon="icon-italic" tooltip={IntlComponent.get('italic')} />
      <BubbleButton editor={editor} mark="underline" icon="icon-underline" tooltip={IntlComponent.get('underline')} />
      <BubbleButton editor={editor} mark="strike" icon="icon-strike" tooltip={IntlComponent.get('strike')} />
      <LinkButton editor={editor} />
      <span className="textory-text-bubble__divider" />
      <FontSizeDropdown editor={editor} />
      <ColorDropdown editor={editor} type="color" />
      <ColorDropdown editor={editor} type="highlight" />
      <span className="textory-text-bubble__divider" />
      <BubbleButton
        editor={editor}
        icon="icon-geshishua"
        tooltip={IntlComponent.get('textbubble.clear.format')}
        onClick={() => editor.chain().focus().unsetAllMarks().run()}
      />
    </BubbleMenu>
  );
};

export default TextBubbleMenu;
