import { Editor } from '@tiptap/core';
import { Document } from '@tiptap/extension-document';
import { Paragraph } from '@tiptap/extension-paragraph';
import { Text } from '@tiptap/extension-text';
import { describe, expect, it } from 'vitest';
// 深层导入：barrel 会连带加载 editor-common-ui 的 iconfont 脚本，在 happy-dom 下不可执行
import { MARK_TYPES } from '../../editor-utils/src/constants';
import { Bold } from './bold';

function createHeadlessEditor() {
  return new Editor({
    extensions: [Document, Paragraph, Text, Bold],
    content: '<p>hello world</p>',
  });
}

describe('Bold schema', () => {
  it('mark 名称与 MARK_TYPES.B 常量一致', () => {
    const editor = createHeadlessEditor();
    expect(editor.schema.marks[MARK_TYPES.B]).toBeDefined();
    expect(Bold.config.name).toBe(MARK_TYPES.B);
    editor.destroy();
  });
});

describe('Bold 命令（无头 Tiptap 实例）', () => {
  it('对选区应用/取消加粗', () => {
    const editor = createHeadlessEditor();
    editor.commands.setTextSelection({ from: 1, to: 6 });
    editor.commands.toggleBold();
    expect(editor.getHTML()).toBe('<p><strong>hello</strong> world</p>');

    editor.commands.toggleBold();
    expect(editor.getHTML()).toBe('<p>hello world</p>');
    editor.destroy();
  });

  it('isActive 反映当前加粗状态', () => {
    const editor = createHeadlessEditor();
    editor.commands.setTextSelection({ from: 1, to: 6 });
    expect(editor.isActive('bold')).toBe(false);

    editor.commands.setBold();
    expect(editor.isActive('bold')).toBe(true);
    editor.destroy();
  });
});
