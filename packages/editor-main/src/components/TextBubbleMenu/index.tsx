import {MARK_TYPES, BLOCK_TYPES, BubbleMenu} from '@textory/editor-common';
import type {Editor} from '@tiptap/core';
import {TextSelection} from '@tiptap/pm/state';
import {type FC, useCallback} from 'react';
import type {BubbleMenuProps} from '@tiptap/react/menus';
import {searchReplacePluginKey} from '@textory/extension-search-replace';
import BubbleButton from './BubbleButton';
import ColorDropdown from './ColorDropdown';
import FontSizeDropdown from './FontSizeDropdown';
import HeadingDropdown from './HeadingDropdown';
import LinkButton from './LinkButton';
import AlignDropdown from "./AlignDropdown.tsx";
import {useEditorState} from "@tiptap/react";

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
  const caps = useEditorState({
    editor,
    selector: ({ editor }) => ({
      canLink:
        !!editor.state.schema.marks[MARK_TYPES.LK] &&
        editor.can().chain().focus().toggleMark(MARK_TYPES.LK).run(),
      canUndo: editor.can().chain().focus().undo?.().run(),
      canRedo: editor.can().chain().focus().redo?.().run(),
      canBold: editor.can().chain().focus().toggleBold().run(),
      canItalic: editor.can().chain().focus().toggleItalic().run(),
      canUnderline: editor.can().chain().focus().toggleUnderline().run(),
      canStrike: editor.can().chain().focus().toggleStrike().run(),
      canUL: editor.can().chain().toggleBulletList?.().run(),
      canOL: editor.can().chain().toggleOrderedList?.().run(),
      canCL: editor.can().chain().toggleTaskList?.().run(),
      canIndent: editor.can().chain().focus().indent().run(),
      canOutdent: editor.can().chain().focus().outdent().run(),
    }),
  });
  const shouldShow = useCallback<BubbleMenuProps['shouldShow']>(props => {
    const {editor, from, to, state} = props;
    if (!editor.isEditable) return false;
    if (editor.isEmpty) return false;
    if (editor.view.dragging) return false;
    if (from === to) return false;
    if (!(state.selection instanceof TextSelection)) return false;
    // 搜索替换跳转（goToMatch/replaceNext）设置的选区不是用户选择，
    // 不唤起文字工具栏。读 plugin state（同步），用户下一次交互事务会重置该标记。
    if (searchReplacePluginKey.getState(state)?.programmaticSelection) return false;
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
      <AlignDropdown editor={editor}/>
      <span className="textory-text-bubble__divider" />
      <FontSizeDropdown editor={editor} />
      <span className="textory-text-bubble__divider" />
      <BubbleButton id="bold" editor={editor} mark="bold" icon="icon-bold" tooltip="bold" disabled={!caps.canBold}/>
      <BubbleButton id="italic" editor={editor} mark="italic" icon="icon-italic" tooltip="italic" disabled={!caps.canItalic}/>
      <BubbleButton id="underline" editor={editor} mark="underline" icon="icon-underline" tooltip="underline" disabled={!caps.canUnderline}/>
      <BubbleButton id="strike" editor={editor} mark="strike" icon="icon-strike" tooltip="strike" disabled={!caps.canStrike}/>
      <LinkButton editor={editor} disabled={!caps.canLink}/>
      <BubbleButton id="code" editor={editor} mark="code" icon="icon-code-inline" tooltip="code.inline"/>
      <span className="textory-text-bubble__divider" />
      <ColorDropdown editor={editor} type="color" />
      <ColorDropdown editor={editor} type="highlight" />
      <span className="textory-text-bubble__divider" />
      <BubbleButton
        id="geshishua"
        editor={editor}
        icon="icon-geshishua"
        tooltip="textbubble.clear.format"
        onClick={() => editor.chain().focus().unsetAllMarks().run()}
      />
    </BubbleMenu>
  );
};

export default TextBubbleMenu;
