import {mergeAttributes, Node} from '@tiptap/core';

export interface TaskListOptions {
  /**
   * The node type name for a task item.
   * @default 'taskItem'
   * @example 'myCustomTaskItem'
   */
  itemTypeName: string;

  /**
   * The HTML attributes for a task list node.
   * @default {}
   * @example { class: 'foo' }
   */
  HTMLAttributes: Record<string, any>;
}

/**
 * This extension allows you to create task lists.
 * @see https://www.tiptap.dev/api/nodes/task-list
 */
export const TaskList = Node.create<TaskListOptions>({
  name: 'checkList',

  addOptions() {
    return {
      itemTypeName: 'checkListItem',
      HTMLAttributes: { class: 'check-list' },
    };
  },

  group: 'block list',

  content() {
    return `${this.options.itemTypeName}+`;
  },

  parseHTML() {
    return [
      {
        tag: `ul[data-type="${this.name}"]`,
        priority: 51,
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'ul',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        'data-type': this.name,
      }),
      0,
    ];
  },

  // Markdown 序列化（@tiptap/markdown 的 getMarkdown()）：checkList 渲染为
  // 连续的任务列表行，缩进行为与 bulletList 一致
  renderMarkdown: (node, h) => {
    if (!node.content) {
      return '';
    }
    return h.renderChildren(node.content, '\n');
  },
  markdownOptions: {
    indentsContent: true,
  },

  addCommands() {
    return {
      toggleTaskList:
        () =>
        ({ commands }) => {
          return commands.toggleList(this.name, this.options.itemTypeName);
        },
    };
  },

  addKeyboardShortcuts() {
    return {
      'Mod-Shift-9': () => this.editor.commands.toggleTaskList(),
    };
  },
});
