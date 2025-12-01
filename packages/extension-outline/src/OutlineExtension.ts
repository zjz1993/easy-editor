// OutlineExtension.ts
import {Extension} from '@tiptap/core'

export interface OutlineItem {
  level: number;
  text: string;
  pos: number;
  children: OutlineItem[];
}

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

  addCommands() {
    return {};
  },
});
