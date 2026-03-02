import {Plugin, PluginKey} from '@tiptap/pm/state';
import {v4 as uuidv4} from 'uuid';

const UniqueIdPluginKey = new PluginKey('uniqueId');

function createUniqueIdPluginNew() {
  return new Plugin({
    key: UniqueIdPluginKey,

    // 添加状态来追踪是否已经初始化
    state: {
      init() {
        return {
          initialized: false,
        };
      },
      apply(tr, oldState) {
        // 如果文档有变化，标记为已初始化
        if (tr.docChanged) {
          return {
            initialized: true,
          };
        }
        return oldState;
      },
    },

    appendTransaction(transactions, oldState, newState) {
      // 如果这个事务是我们自己触发的，跳过处理
      if (transactions.some(tr => tr.getMeta(UniqueIdPluginKey))) return null;

      // 检查是否有文档变化
      if (!transactions.some(tr => tr.docChanged)) return null;

      const tr = newState.tr;
      let modified = false;

      // 获取插件状态
      const pluginState = this.getState(newState);

      // 检查是否是首次初始化（从空文档到有内容）
      const isFirstInit =
        oldState.doc.content.size === 0 && newState.doc.content.size > 0;

      if (isFirstInit) {
        // 首次初始化：为所有没有ID的块级节点分配ID
        const doc = newState.doc;
        doc.descendants((node, pos) => {
          if (!node.isBlock) return;
          if (!node.attrs.id) {
            tr.setNodeAttribute(pos, 'id', uuidv4());
            modified = true;
          }
        });
      } else {
        // 后续更新：只为新插入的内容分配ID
        transactions.forEach(transaction => {
          console.log('transactions触发', transaction);
          if (!transaction.docChanged) return;

          transaction.steps.forEach(step => {
            // 只处理替换步骤（新内容插入）
            if (
              step.constructor.name === 'ReplaceStep' ||
              step.constructor.name === '_ReplaceStep'
            ) {
              const { from, to } = step as any;
              const slice = (step as any).slice;

              if (slice?.content && slice.content.size > 0) {
                const docSize = newState.doc.content.size;
                const endPos = Math.min(to + slice.content.size, docSize);

                if (from >= 0 && endPos <= docSize && from <= endPos) {
                  newState.doc.nodesBetween(from, endPos, (node, nodePos) => {
                    console.log('遍历触发', node);
                    if (!node.isBlock) return;

                    // 检查是否已有ID，以及是否有重复ID
                    const existingIds = new Set();
                    newState.doc.descendants((n, p) => {
                      if (n !== node && n.attrs.id) existingIds.add(n.attrs.id);
                    });

                    if (!node.attrs.id || !existingIds.has(node.attrs.id)) {
                      tr.setNodeAttribute(nodePos, 'id', uuidv4());
                      modified = true;
                    }
                  });
                }
              }
            }
          });
        });
      }

      if (!modified) return null;

      // 标记这个事务是我们触发的，避免无限循环
      tr.setMeta(UniqueIdPluginKey, true);
      return tr;
    },
  });
}

export default createUniqueIdPluginNew;
