import {Extension} from '@tiptap/core';
import {Plugin, PluginKey} from '@tiptap/pm/state';
import {v4 as uuidv4} from 'uuid';
import {BLOCK_TYPES} from "@easy-editor/editor-common";

const UniqueIDExtension = Extension.create({
  name: 'uniqueID',
  priority: 100,

  addGlobalAttributes() {
    return [
      {
        types: [
          BLOCK_TYPES.P,
          BLOCK_TYPES.H,
          BLOCK_TYPES.CODE,
          BLOCK_TYPES.IMG,
        ],
        attributes: {
          id: {
            default: null,
            parseHTML: element => element.getAttribute('data-id'),
            renderHTML: attributes => {
              return attributes.id ? { 'data-id': attributes.id } : {};
            },
          },
        },
      },
    ];
  },

  addStorage() {
    return {
      modified: false,
    };
  },
  addProseMirrorPlugins() {
    return [UniqueId()];
  },
});

function UniqueId(): Plugin {
  return new Plugin({
    key: new PluginKey('uniqueId'),
    //appendTransaction: (transactions, oldState, newState) => {
    //  const tr = newState.tr;
    //  let modified = false;
    //
    //  // 检查事务中的步骤
    //  transactions.forEach(transaction => {
    //    if (!transaction.docChanged) return;
    //
    //    // 遍历新状态的文档
    //    newState.doc.descendants((node, pos) => {
    //      if (node.isBlock) {
    //        const existingIds = new Set();
    //        newState.doc.descendants((n, p) => {
    //          if (n !== node && n.attrs.id) existingIds.add(n.attrs.id);
    //        });
    //
    //        if (!node.attrs.id || existingIds.has(node.attrs.id)) {
    //          const newId = uuidv4();
    //          tr.setNodeAttribute(pos, 'id', newId);
    //          modified = true;
    //        }
    //      }
    //    });
    //  });
    //
    //  return modified ? tr : null;
    //},

    appendTransaction: (transactions, oldState, newState) => {
      if (!newState || !newState.doc) {
        console.error('newState or newState.doc is undefined');
        return null;
      }
      const tr = newState.tr;
      let modified = false;

      transactions.forEach(transaction => {
        if (!transaction.docChanged) return;

        transaction.steps.forEach((step, index) => {
          if (step.constructor.name === '_ReplaceStep') {
            const { from, to } = step as any;
            const slice = (step as any).slice;

            if (slice?.content) {
              const docSize = newState.doc.content.size;
              const endPos = Math.min(to + slice.content.size, docSize);

              if (from >= 0 && endPos <= docSize && from <= endPos) {
                newState.doc.nodesBetween(from, endPos, (node, nodePos) => {
                  if (node.isBlock) {
                    const existingIds = new Set();
                    newState.doc.descendants((n, p) => {
                      if (n !== node && n.attrs.id) existingIds.add(n.attrs.id);
                    });

                    if (!node.attrs.id || existingIds.has(node.attrs.id)) {
                      const newId = uuidv4();
                      tr.setNodeAttribute(nodePos, 'id', newId);
                      modified = true;
                    }
                  }
                });
              } else {
                console.warn(
                  `Invalid range: ${from} to ${endPos}, doc size: ${docSize}`,
                );
              }
            }
          }
        });
      });

      // 为初始内容分配 ID
      if (oldState.doc.content.size === 0 && newState.doc.content.size > 0) {
        newState.doc.descendants((node, pos) => {
          if (node.isBlock && !node.attrs.id) {
            const newId = uuidv4();
            tr.setNodeAttribute(pos, 'id', newId);
            modified = true;
          }
        });
      }

      return modified ? tr : null;
    },
  });
}

export default UniqueIDExtension;
