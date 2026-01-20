import {BLOCK_TYPES} from '@textory/editor-common';
import type {CodeBlockLowlightOptions} from '@tiptap/extension-code-block-lowlight';
import {CodeBlockLowlight} from '@tiptap/extension-code-block-lowlight';
import {Plugin, PluginKey, TextSelection} from '@tiptap/pm/state';
import {ReactNodeViewRenderer} from '@tiptap/react';
import {lowlight} from 'lowlight';
import {CodeBlockNodeView} from './CodeBlockNodeView';
import {getSelectedLineRange} from './utils';
import {languages} from "./languages.ts";

export type CodeBlockOptions = CodeBlockLowlightOptions;

const langAliasMap = (() => {
  const map = new Map<string, string>();

  languages.forEach(l => {
    map.set(l.value, l.value);
    l.alias.forEach(a => map.set(a, l.value));
  });

  return map;
})();

export function detectLanguage(text: string): string {
  const trimmed = text.trim();

  // ========== JSON ==========
  if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
    try {
      JSON.parse(text);
      return 'json';
    } catch {}
  }

  // ========== YAML ==========
  // YAML 有“- ”列表或 key: value 格式，且没有大括号
  if (!/[{}<>]/.test(text) && /^(\s*\w+:\s+.+\n?)+/m.test(text)) {
    return 'yaml';
  }
  if (/^-\s+\w+/.test(text)) {
    return 'yaml';
  }

  // ========== HTML/XML ==========
  if (/^\s*<([A-Za-z][A-Za-z0-9]*)\b[^>]*>/.test(text)) {
    return 'xml';
  }

  // ========== SQL ==========
  if (
    /\b(SELECT|INSERT|UPDATE|DELETE|FROM|WHERE|JOIN|CREATE|ALTER|TABLE|VALUES)\b/i.test(
      text,
    )
  ) {
    return 'sql';
  }

  // ========== CSS ==========
  if (/^[.#]?[A-Za-z0-9_-]+\s*{[^}]+}/m.test(text)) {
    return 'css';
  }

  // ========== Java ==========
  if (
    /\b(class|interface|public|private|protected|static|void|new)\b/.test(
      text,
    ) &&
    /{[\s\S]*}/.test(text)
  ) {
    return 'java';
  }

  // ========== TS/JS/JSX/TSX ==========
  // JSX 特征
  if (/<[A-Z][A-Za-z0-9]*\b[^>]*>/.test(text) && /{.*}/.test(text)) {
    return 'javascript'; // 你 jsx 归属于 js
  }

  // TypeScript 特征
  if (/\binterface\b|\btype\b/.test(text)) {
    return 'typescript';
  }

  // JavaScript 特征
  if (/\b(import|export|const|let|var|function|=>)\b/.test(text)) {
    return 'javascript';
  }

  // ========== fallback → highlightAuto ==========
  const result = lowlight.highlightAuto(text);
  const lang = result.data.language;

  if (lang && langAliasMap.has(lang)) {
    return langAliasMap.get(lang)!;
  }

  if (lang === 'plaintext' || lang === 'text' || lang === 'markdown') {
    return undefined;
  }

  return undefined;
}

export const CodeBlock = CodeBlockLowlight.extend<CodeBlockOptions>({
  name: BLOCK_TYPES.CODE,

  addOptions() {
    return {
      ...this.parent?.(),
      lowlight,
      defaultLanguage: 'plaintext',
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(CodeBlockNodeView);
  },

  addCommands() {
    return {
      ...this.parent?.(),
      toggleCodeBlock:
        attributes =>
        ({ commands, editor, chain }) => {
          const { state } = editor;
          const { from, to } = state.selection;

          // 如果选中范围是连续段落，则合并后转成一个 codeBlock
          if (!state.selection.empty) {
            let isSelectConsecutiveParagraphs = true;
            const textArr: string[] = [];
            state.doc.nodesBetween(from, to, (node, pos) => {
              if (node.isInline) {
                return false;
              }
              if (node.type.name !== 'paragraph') {
                if (pos + 1 <= from && pos + node.nodeSize - 1 >= to) {
                  // 不要返回 false, 否则会中断遍历子节点
                  return;
                }
                isSelectConsecutiveParagraphs = false;
                return false;
              }
              const selectedText = (node.textContent || '').slice(
                pos + 1 > from ? 0 : from - pos - 1,
                pos + node.nodeSize - 1 < to ? node.nodeSize - 1 : to - pos - 1,
              );
              textArr.push(selectedText || '');
            });
            // 仅处理选择连续多个段落的情况
            if (isSelectConsecutiveParagraphs && textArr.length > 1) {
              return chain()
                .command(({ state, tr }) => {
                  tr.replaceRangeWith(
                    from,
                    to,
                    this.type.create(
                      attributes,
                      state.schema.text(textArr.join('\n')),
                    ),
                  );
                  return true;
                })
                .setTextSelection({
                  from: from + 2,
                  to: from + 2,
                })
                .run();
            }
          }

          return commands.toggleNode(this.name, 'paragraph', attributes);
        },
    };
  },

  addKeyboardShortcuts() {
    return {
      ...this.parent?.(),
      Tab: ({ editor }) => {
        const { state, view } = editor;
        //if (!isActive(state, this.name)) {
        //  return false;
        //}
        const { selection, tr } = state;
        const tab = '  ';
        if (selection.empty) {
          view.dispatch(tr.insertText(tab));
        } else {
          const { $from, from, to } = selection;
          const node = $from.node(); // code block node
          if (node.type !== this.type) {
            return false;
          }

          const { start: selectedLineStart, end: selectedLineEnd } =
            getSelectedLineRange(selection, node);
          if (
            selectedLineStart === undefined ||
            selectedLineEnd === undefined
          ) {
            view.dispatch(tr.replaceSelectionWith(state.schema.text(tab)));
            return true;
          }

          const text = node.textContent || '';
          const lines = text.split('\n');
          const newLines = lines.map((line, index) => {
            if (
              index >= selectedLineStart &&
              index <= selectedLineEnd &&
              line
            ) {
              return tab + line;
            }
            return line;
          });
          const codeBlockTextNode = $from.node(1);
          const codeBlockTextNodeStart = $from.start(1);
          tr.replaceWith(
            codeBlockTextNodeStart,
            codeBlockTextNodeStart + codeBlockTextNode.nodeSize - 2,
            state.schema.text(newLines.join('\n')),
          );
          tr.setSelection(
            TextSelection.between(
              tr.doc.resolve(from + tab.length),
              tr.doc.resolve(
                to + (selectedLineEnd - selectedLineStart + 1) * tab.length,
              ),
            ),
          );
          view.dispatch(tr);
        }
        return true;
      },
    };
  },

  addProseMirrorPlugins() {
    return [
      ...(this.parent?.() || []),
      new Plugin({
        key: new PluginKey('codeBlockVSCodeHandler'),
        props: {
          handlePaste: (view, event) => {
            if (!event.clipboardData) {
              return false;
            }

            // don’t create a new code block within code blocks
            if (this.editor.isActive(this.type.name)) {
              return false;
            }

            const text = event.clipboardData.getData('text/plain');
            const vscode = event.clipboardData.getData('vscode-editor-data');
            const vscodeData = vscode ? JSON.parse(vscode) : undefined;
            const language = vscodeData?.mode || detectLanguage(text);
            if (!text || !text.includes('\n') || !language) {
              return false;
            }

            const { tr, schema } = view.state;

            // prepare a text node
            // strip carriage return chars from text pasted as code
            // see: https://github.com/ProseMirror/prosemirror-view/commit/a50a6bcceb4ce52ac8fcc6162488d8875613aacd
            const textNode = schema.text(text.replace(/\r\n?/g, '\n'));

            // create a code block with the text node
            // replace selection with the code block
            tr.replaceSelectionWith(this.type.create({ language }, textNode));

            if (tr.selection.$from.parent.type !== this.type) {
              // put cursor inside the newly created code block
              tr.setSelection(
                TextSelection.near(
                  tr.doc.resolve(Math.max(0, tr.selection.from - 2)),
                ),
              );
            }

            // store meta information
            // this is useful for other plugins that depends on the paste event
            // like the paste rule plugin
            tr.setMeta('paste', true);

            view.dispatch(tr);

            return true;
          },
        },
      }),
    ];
  },
});
