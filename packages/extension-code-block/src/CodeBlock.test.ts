import {describe, expect, it} from 'vitest';
import {Editor} from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import {CodeBlock} from './CodeBlock';

/**
 * CodeBlock 的 handlePaste 行为边界回归：
 * - 纯文本多行代码 → 代码块（原行为）
 * - 剪贴板带 text/html → 让位默认 HTML 粘贴（2026-08-18 修复：
 *   此前 html 存在时仍按 plain 文本嗅探抢走，导致从 ChatGPT/网页复制的
 *   Markdown 被 detectLanguage 误判成代码块，见
 *   .ai/specs/2026-08-18-markdown-paste-input/spec.md §4）
 * - VSCode 元数据优先于 html（VSCode 复制仍为代码块）
 */
function createEditor() {
  return new Editor({
    extensions: [StarterKit.configure({codeBlock: false}), CodeBlock],
    content: '<p></p>',
  });
}

function runPaste(editor: Editor, data: Record<string, string>): boolean {
  const dt = new DataTransfer();
  Object.entries(data).forEach(([type, value]) => dt.setData(type, value));
  const event = new ClipboardEvent('paste', {clipboardData: dt});
  for (const plugin of editor.state.plugins) {
    const handler = (plugin as any).props?.handlePaste;
    if (typeof handler === 'function' && handler.call(plugin, editor.view, event)) {
      return true;
    }
  }
  return false;
}

describe('CodeBlock handlePaste', () => {
  it('纯文本多行代码 → 代码块', () => {
    const editor = createEditor();
    editor.commands.focus('end');
    const handled = runPaste(editor, {
      'text/plain': 'const a = 1;\nfunction run() {\n  return a;\n}',
    });
    expect(handled).toBe(true);
    expect(editor.getJSON().content?.some(n => n.type === 'codeBlock')).toBe(true);
    editor.destroy();
  });

  it('剪贴板带 text/html 时不接管（走默认 HTML 粘贴）', () => {
    const editor = createEditor();
    editor.commands.focus('end');
    const handled = runPaste(editor, {
      'text/html': '<h1>标题</h1><p>正文</p>',
      'text/plain': '# 标题\n\nconst a = 1;\nconst b = 2;',
    });
    expect(handled).toBe(false);
    expect(editor.getJSON().content?.some(n => n.type === 'codeBlock')).toBe(false);
    editor.destroy();
  });

  it('VSCode 元数据优先于 html（VSCode 复制仍为代码块）', () => {
    const editor = createEditor();
    editor.commands.focus('end');
    const handled = runPaste(editor, {
      'text/html': '<span style="color:#ccc">const a = 1;</span>',
      'text/plain': 'const a = 1;\nconst b = 2;',
      'vscode-editor-data': '{"mode":"typescript"}',
    });
    expect(handled).toBe(true);
    expect(editor.getJSON().content?.some(n => n.type === 'codeBlock')).toBe(true);
    editor.destroy();
  });
});
