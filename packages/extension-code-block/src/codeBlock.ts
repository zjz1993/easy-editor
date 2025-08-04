import {Node} from '@tiptap/core';
import {ReactNodeViewRenderer} from '@tiptap/react';
import {CodeBlockNodeView} from './CodeBlockNodeView.tsx';
import {TextSelection} from '@tiptap/pm/state';
import {BLOCK_TYPES} from '@easy-editor/editor-common';

export const backtickInputRegex = /^[`·]{3}([a-z]+)?[\s\n]$/;
export const tildeInputRegex = /^[~～]{3}([a-z]+)?[\s\n]$/;

export const CodeBlock = Node.create({
  name: BLOCK_TYPES.CODE,

  group: 'block',
  content: `${BLOCK_TYPES.CODE_LINE}+`,
  isolating: true,
  defining: true,
  addAttributes() {
    return {
      language: {
        default: 'javascript',
      },
    };
  },

  parseHTML() {
    return [{ tag: 'pre[data-type="custom-code-block"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['pre', { ...HTMLAttributes, 'data-type': 'custom-code-block' }, 0];
  },

  addCommands() {
    return {
      ...this.parent?.(),
      insertCodeBlock:
        () =>
        ({ commands, state }) => {
          const { $from } = state.selection;
          const parent = $from.node(-1);

          if (parent.type.name === BLOCK_TYPES.CODE) {
            // 如果当前在 code block 中，转为普通段落
            return commands.lift(BLOCK_TYPES.CODE);
          }

          return commands.insertContent({
            type: BLOCK_TYPES.CODE,
            content: [
              {
                type: BLOCK_TYPES.CODE_LINE,
                content: [
                  {
                    type: 'text',
                    text: '\u200B', // 非空内容
                  },
                ],
              },
            ],
          });
        },
    };
  },

  addKeyboardShortcuts() {
    return {
      Enter: ({ editor }) => {
        const { state } = editor;
        const tr = state.tr;
        const { selection } = state;
        const { $from } = selection;

        if ($from.parent.type.name !== 'codeLine') return false;

        const pos = $from.end();
        const node = editor.schema.nodes.codeLine.createAndFill();

        if (!node) return false;

        tr.insert(pos, node);
        tr.setSelection(TextSelection.near(tr.doc.resolve(pos + 1)));
        editor.view.dispatch(tr);
        return true;
      },

      Backspace: ({ editor }) => {
        const { state } = editor;
        const tr = state.tr;
        const { selection } = state;
        const { $from } = selection;

        if ($from.parent.type.name !== 'codeLine') return false;

        const isEmpty = $from.parent.textContent === '';
        const isFirst = $from.parentOffset === 0;

        if (isEmpty && isFirst) {
          // 移除整个代码块
          const $grandParent = state.doc.resolve($from.before($from.depth - 1));
          const pos = $grandParent.before();
          tr.delete(pos, pos + $grandParent.nodeAfter.nodeSize);
          const newSelection = TextSelection.create(tr.doc, pos);
          tr.setSelection(newSelection);
          editor.view.dispatch(tr);
          return true;
        }

        return false;
      },

      'Mod-Enter': () => false,
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(CodeBlockNodeView);
  },
});

//export const CodeBlock = CodeBlockLowlight.extend<CodeBlockOptions>({
//  name: BLOCK_TYPES.CODE,
//
//  addOptions() {
//    return {
//      ...this.parent?.(),
//      lowlight,
//      defaultLanguage: 'plaintext',
//    };
//  },
//
//  addNodeView() {
//    return ReactNodeViewRenderer(CodeBlockNodeView);
//  },
//
//  addCommands() {
//    return {
//      ...this.parent?.(),
//      toggleCodeBlock:
//        attributes =>
//        ({ commands, editor, chain }) => {
//          const { state } = editor;
//          const { from, to } = state.selection;
//
//          // 如果选中范围是连续段落，则合并后转成一个 codeBlock
//          if (!state.selection.empty) {
//            let isSelectConsecutiveParagraphs = true;
//            const textArr: string[] = [];
//            state.doc.nodesBetween(from, to, (node, pos) => {
//              if (node.isInline) {
//                return false;
//              }
//              if (node.type.name !== 'paragraph') {
//                if (pos + 1 <= from && pos + node.nodeSize - 1 >= to) {
//                  // 不要返回 false, 否则会中断遍历子节点
//                  return;
//                }
//                isSelectConsecutiveParagraphs = false;
//                return false;
//              }
//              const selectedText = (node.textContent || '').slice(
//                pos + 1 > from ? 0 : from - pos - 1,
//                pos + node.nodeSize - 1 < to ? node.nodeSize - 1 : to - pos - 1,
//              );
//              textArr.push(selectedText || '');
//            });
//            // 仅处理选择连续多个段落的情况
//            if (isSelectConsecutiveParagraphs && textArr.length > 1) {
//              return chain()
//                .command(({ state, tr }) => {
//                  tr.replaceRangeWith(
//                    from,
//                    to,
//                    this.type.create(
//                      attributes,
//                      state.schema.text(textArr.join('\n')),
//                    ),
//                  );
//                  return true;
//                })
//                .setTextSelection({
//                  from: from + 2,
//                  to: from + 2,
//                })
//                .run();
//            }
//          }
//
//          return commands.toggleNode(this.name, 'paragraph', attributes);
//        },
//    };
//  },
//
//  addKeyboardShortcuts() {
//    return {
//      ...this.parent?.(),
//      Tab: ({ editor }) => {
//        const { state, view } = editor;
//        //if (!isActive(state, this.name)) {
//        //  return false;
//        //}
//        const { selection, tr } = state;
//        const tab = '  ';
//        if (selection.empty) {
//          view.dispatch(tr.insertText(tab));
//        } else {
//          const { $from, from, to } = selection;
//          const node = $from.node(); // code block node
//          if (node.type !== this.type) {
//            return false;
//          }
//
//          const { start: selectedLineStart, end: selectedLineEnd } =
//            getSelectedLineRange(selection, node);
//          if (
//            selectedLineStart === undefined ||
//            selectedLineEnd === undefined
//          ) {
//            view.dispatch(tr.replaceSelectionWith(state.schema.text(tab)));
//            return true;
//          }
//
//          const text = node.textContent || '';
//          const lines = text.split('\n');
//          const newLines = lines.map((line, index) => {
//            if (
//              index >= selectedLineStart &&
//              index <= selectedLineEnd &&
//              line
//            ) {
//              return tab + line;
//            }
//            return line;
//          });
//          const codeBlockTextNode = $from.node(1);
//          const codeBlockTextNodeStart = $from.start(1);
//          tr.replaceWith(
//            codeBlockTextNodeStart,
//            codeBlockTextNodeStart + codeBlockTextNode.nodeSize - 2,
//            state.schema.text(newLines.join('\n')),
//          );
//          tr.setSelection(
//            TextSelection.between(
//              tr.doc.resolve(from + tab.length),
//              tr.doc.resolve(
//                to + (selectedLineEnd - selectedLineStart + 1) * tab.length,
//              ),
//            ),
//          );
//          view.dispatch(tr);
//        }
//        return true;
//      },
//    };
//  },
//
//  addInputRules() {
//    return [
//      //textblockTypeInputRule({
//      //  find: backtickInputRegex,
//      //  type: this.type,
//      //  getAttributes: match => ({
//      //    language:
//      //      getLanguageByValueOrAlias(match[1])?.value ||
//      //      this.options.defaultLanguage,
//      //  }),
//      //  autoFocus: true,
//      //}),
//      //textblockTypeInputRule({
//      //  find: tildeInputRegex,
//      //  type: this.type,
//      //  getAttributes: match => ({
//      //    language:
//      //      getLanguageByValueOrAlias(match[1])?.value ||
//      //      this.options.defaultLanguage,
//      //  }),
//      //  autoFocus: true,
//      //}),
//    ];
//  },
//});
