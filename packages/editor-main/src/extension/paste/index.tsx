import { Extension } from '@tiptap/core';
import CustomLink from '../../node/link/index';
import PastePlugin from './pastePlugin';

const PasteExtension = Extension.create({
  name: 'custom_paste',
  addExtensions: () => {
    return [CustomLink];
  },
  addProseMirrorPlugins: () => {
    return [PastePlugin()];
  },
  addKeyboardShortcuts() {
    return {
      Backspace: () => {
        const {
          state,
          view: { dispatch },
        } = this.editor;
        const { selection } = state;
        const { $from } = selection;
        const { pos } = $from;
        const node = state.doc.nodeAt(pos);
        console.log('删除触发', selection);
        if (node && node.type.name === 'custom_link') {
          const { tr } = state;

          // 删除当前节点（包括节点内的内容）
          tr.delete(pos, node.nodeSize);
          dispatch(tr);
          return true; // 阻止默认行为
        }

        return false; // 默认行为
      },
    };
  },
});
export default PasteExtension;
