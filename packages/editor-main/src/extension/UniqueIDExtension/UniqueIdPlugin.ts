import { Plugin } from '@tiptap/pm/state';

// 生成唯一 ID
const generateUniqueID = () => {
  return Math.random().toString(36).substring(2, 9);
};

const UniqueIdPlugin = () => {
  return new Plugin({
    props: {
      // 在创建新节点时自动分配唯一 ID
      handleDOMEvents: {
        beforeinput: (view, event) => {
          const { state, dispatch } = view;
          const tr = state.tr;

          state.doc.descendants((node, pos) => {
            if (node.isBlock && !node.attrs.id) {
              tr.setNodeMarkup(pos, undefined, {
                ...node.attrs,
                id: generateUniqueID(),
              });
            }
          });

          dispatch(tr);
          return false;
        },
      },
    },
  });
};

export default UniqueIdPlugin;
