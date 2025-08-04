import {Node} from '@tiptap/core';
import {ReactNodeViewRenderer} from '@tiptap/react';
import CodeLineNodeView from './CodeLineView.tsx';
import {BLOCK_TYPES} from '@easy-editor/editor-common';

export const CodeLine = Node.create({
  name: BLOCK_TYPES.CODE_LINE,
  group: 'block',
  content: 'text*',
  marks: '', // 不允许加粗、斜体等
  defining: true,
  selectable: false,
  addOptions() {
    return {};
  },

  parseHTML() {
    return [{ tag: 'div[data-type="code-line"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', { ...HTMLAttributes, 'data-type': 'code-line' }, 0];
  },
  addNodeView() {
    return ReactNodeViewRenderer(CodeLineNodeView);
  },
});
