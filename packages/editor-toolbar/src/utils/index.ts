import { isWindows } from '@easy-editor/editor-common';
import type { Editor } from '@tiptap/core';
import { TextSelection } from '@tiptap/pm/state';

export const command = isWindows() ? 'Ctrl' : '⌘';

export const option = isWindows() ? 'Alt' : 'Option';

// 在点击工具栏设置过后重新恢复点击工具栏之前的选取
export const setTextSelectionAfterChange = (
  editor: Editor,
  fun?: () => void,
) => {
  if (!editor) return;

  const { state, view } = editor;
  const { from, to } = state.selection; // 记录当前选区位置
  fun?.();
  setTimeout(() => {
    const newState = editor.state; // 重新获取最新 state
    const transaction = newState.tr.setSelection(
      TextSelection.create(newState.doc, from, to),
    );
    view.dispatch(transaction); // 重新设置选区
  }, 0);
};
