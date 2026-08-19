// OutlineExtension.ts
import {Extension} from '@tiptap/core';
import {Plugin, PluginKey} from '@tiptap/pm/state';
import {Decoration, DecorationSet} from '@tiptap/pm/view';
import type {Node as PMNode} from '@tiptap/pm/model';

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

// 大纲重算防抖间隔。doc.descendants 是 O(全文) 遍历，大文档下逐键执行
// 会拖慢打字；防抖到输入停顿后统一重算（onCreate 的初始计算不受影响）。
const OUTLINE_DEBOUNCE_MS = 300;

// 每个编辑器实例一个 pending 计时器，避免污染公开的 storage 类型
const outlineTimers = new WeakMap<object, number | undefined>();

function computeOutlineItems(doc: PMNode): OutlineItem[] {
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

  return items;
}

export const OutlineExtension = Extension.create({
  name: 'outline',

  addStorage() {
    return {
      outline: [] as OutlineItem[],
    };
  },

  onCreate() {
    // 初始大纲：初始 content 不触发 onUpdate，这里补一次立即计算
    this.storage.outline = computeOutlineItems(this.editor.state.doc);
  },

  onUpdate() {
    // 防抖：输入停顿后重算一次大纲
    const editor = this.editor;
    window.clearTimeout(outlineTimers.get(editor));
    outlineTimers.set(
      editor,
      window.setTimeout(() => {
        outlineTimers.set(editor, undefined);
        if (editor.isDestroyed) return;
        this.storage.outline = computeOutlineItems(editor.state.doc);
      }, OUTLINE_DEBOUNCE_MS),
    );
  },

  onDestroy() {
    window.clearTimeout(outlineTimers.get(this.editor));
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
