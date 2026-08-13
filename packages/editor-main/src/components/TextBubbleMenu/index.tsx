import {BLOCK_TYPES, BubbleMenu, IntlComponent} from '@textory/editor-common';
import type {Editor} from '@tiptap/core';
import {type FC, useCallback} from 'react';
import type {BubbleMenuProps} from '@tiptap/react/menus';
import BubbleButton from './BubbleButton';
import ColorDropdown from './ColorDropdown';
import FontSizeDropdown from './FontSizeDropdown';
import HeadingDropdown from './HeadingDropdown';

export interface TextBubbleMenuProps {
  editor: Editor;
}

/**
 * 选中文字时弹出的浮动工具栏。
 *
 * shouldShow 显式排除表格（让 TableBubbleMenu 接管）与代码块，避免两个
 * bubble 同时出现。
 */
export const TextBubbleMenu: FC<TextBubbleMenuProps> = ({editor}) => {
  const shouldShow = useCallback<BubbleMenuProps['shouldShow']>(props => {
    const {editor, from, to} = props;
    if (!editor.isEditable) return false;
    if (editor.isEmpty) return false;
    if (from === to) return false;
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
