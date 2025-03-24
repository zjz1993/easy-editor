import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { v4 as uuidv4 } from 'uuid';
// 生成唯一 ID
const generateUniqueID = () => {
  return Math.random().toString(36).substring(2, 9);
};

const UniqueIDExtension = Extension.create({
  name: 'uniqueID',
  priority: 100,

  addGlobalAttributes() {
    return [
      {
        types: ['paragraph', 'heading', 'blockquote', 'codeBlock'],
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

  addOptions() {
    return {
      generateID: () => generateUniqueID(),
    };
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
    appendTransaction: (transactions, oldState, newState) => {
      const tr = newState.tr;
      let modified = false;

      // 检查事务中的步骤
      transactions.forEach(transaction => {
        if (!transaction.docChanged) return;

        // 遍历新状态的文档
        newState.doc.descendants((node, pos) => {
          if (node.isBlock) {
            const existingIds = new Set();
            newState.doc.descendants((n, p) => {
              if (n !== node && n.attrs.id) existingIds.add(n.attrs.id);
            });

            if (!node.attrs.id || existingIds.has(node.attrs.id)) {
              const newId = uuidv4();
              tr.setNodeAttribute(pos, 'id', newId);
              modified = true;
            }
          }
        });
      });

      return modified ? tr : null;
    },
    //appendTransaction: (transactions, oldState, newState) => {
    //  const tr = newState.tr;
    //  let modified = false;
    //
    //  // 遍历所有事务
    //  transactions.forEach(transaction => {
    //    if (!transaction.docChanged) return;
    //
    //    // 遍历步骤
    //    transaction.steps.forEach((step, index) => {
    //      // 检查是否是 ReplaceStep（通常用于插入新内容）
    //      console.log(step.constructor.name);
    //      if (step instanceof ReplaceStep) {
    //        const { from, to } = step;
    //        const slice = step.slice; // 获取插入的内容
    //        console.log('执行了');
    //        // 检查 slice 中的节点
    //        slice.content.descendants((node, posWithinSlice) => {
    //          if (node.isBlock && !node.attrs.id) {
    //            // 计算节点在文档中的实际位置
    //            const map = step.getMap();
    //            const resolvedPos = map.map(from + posWithinSlice, 1); // 映射到新状态中的位置
    //            const newId = uuidv4();
    //            console.log(
    //              `Assigning ID: ${newId} to new node at pos ${resolvedPos}`,
    //            );
    //            tr.setNodeAttribute(resolvedPos, 'id', newId);
    //            modified = true;
    //          }
    //        });
    //      }
    //    });
    //  });
    //
    //  // 为初始内容分配 ID（可选）
    //  if (oldState.doc.content.size === 0 && newState.doc.content.size > 0) {
    //    newState.doc.descendants((node, pos) => {
    //      if (node.isBlock && !node.attrs.id) {
    //        const newId = uuidv4();
    //        console.log(`Assigning ID: ${newId} to initial node at pos ${pos}`);
    //        tr.setNodeAttribute(pos, 'id', newId);
    //        modified = true;
    //      }
    //    });
    //  }
    //
    //  return modified ? tr : null;
    //},
  });
}

export default UniqueIDExtension;
