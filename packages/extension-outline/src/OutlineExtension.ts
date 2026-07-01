// OutlineExtension.ts
import {Extension} from '@tiptap/core';
import {Plugin, PluginKey} from '@tiptap/pm/state';
import {Decoration, DecorationSet} from '@tiptap/pm/view';

export interface OutlineItem {
  level: number;
  text: string;
  pos: number;
  children: OutlineItem[];
}

/**
 * Plugin key for the heading-flash decoration plugin.
 * Shared with `OutlineView` so the view can dispatch flash / clear transactions.
 */
export const flashPluginKey = new PluginKey<DecorationSet>('headingFlash');

export const OutlineExtension = Extension.create({
  name: 'outline',

  addStorage() {
    return {
      outline: [] as OutlineItem[],
    };
  },

  onUpdate() {
    const editor = this.editor;
    const { doc } = editor.state;

    const items: OutlineItem[] = [];
    const stack: OutlineItem[] = [];

    doc.descendants((node, pos) => {
      if (node.type.name !== 'heading') return;

      const level = node.attrs.level;
      const text = node.textContent;

      const item: OutlineItem = { level, text, pos, children: [] };

      // 第一个标题直接入栈
      if (stack.length === 0) {
        stack.push(item);
        items.push(item);
        return;
      }

      // 找到当前 level 的父节点
      while (stack.length && stack[stack.length - 1].level >= level) {
        stack.pop();
      }

      if (stack.length > 0) {
        // 放入父节点
        stack[stack.length - 1].children.push(item);
      } else {
        // 根层级
        items.push(item);
      }

      stack.push(item);
    });
    this.storage.outline = items;
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: flashPluginKey,
        state: {
          init(): DecorationSet {
            return DecorationSet.empty;
          },
          apply(tr, old: DecorationSet): DecorationSet {
            const meta = tr.getMeta(flashPluginKey);
            if (meta) {
              // Clear all flash decorations.
              if (meta.action === 'clear') {
                return DecorationSet.empty;
              }
              // Add a flash decoration on the node at `pos`.
              if (meta.action === 'flash' && typeof meta.pos === 'number') {
                const node = tr.doc.nodeAt(meta.pos);
                if (node) {
                  const deco = Decoration.node(
                    meta.pos,
                    meta.pos + node.nodeSize,
                    {class: 'textory-outline-flash'},
                  );
                  return DecorationSet.empty.add(tr.doc, [deco]);
                }
                return DecorationSet.empty;
              }
            }
            // Map existing decorations through document changes.
            return old.map(tr.mapping, tr.doc);
          },
        },
        props: {
          decorations(state) {
            return flashPluginKey.getState(state);
          },
        },
      }),
    ];
  },

  addCommands() {
    return {};
  },
});
