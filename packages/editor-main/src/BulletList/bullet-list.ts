import { Node, mergeAttributes, wrappingInputRule } from '@tiptap/core';

import { commonToggleList } from './commonToggleList';
import { TextStyle } from './text-style';

export interface BulletListOptions {
  /**
   * The node name for the list items
   * @default 'listItem'
   * @example 'paragraph'
   */
  itemTypeName: string;

  /**
   * HTML attributes to add to the bullet list element
   * @default {}
   * @example { class: 'foo' }
   */
  HTMLAttributes?: Record<string, any>;

  /**
   * Keep the marks when splitting the list
   * @default false
   * @example true
   */
  keepMarks: boolean;

  /**
   * Keep the attributes when splitting the list
   * @default false
   * @example true
   */
  keepAttributes: boolean;
  content: string;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    bulletList: {
      /**
       * Toggle a bullet list
       */
      toggleBulletList: () => ReturnType;
    };
  }
}

/**
 * Matches a bullet list to a dash or asterisk.
 */
export const inputRegex = /^\s*([-+*])\s$/;

/**
 * This extension allows you to create bullet lists.
 * This requires the ListItem extension
 * @see https://tiptap.dev/api/nodes/bullet-list
 * @see https://tiptap.dev/api/nodes/list-item.
 */
const BulletList = Node.create<BulletListOptions>({
  name: 'bulletList',

  addOptions() {
    return {
      itemTypeName: 'listItem',
      HTMLAttributes: {},
      keepMarks: false,
      keepAttributes: false,
      content: '',
    };
  },

  group: 'block list',

  content() {
    return `${this.options.itemTypeName}+`;
  },

  parseHTML() {
    return [{ tag: 'ul' }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'ul',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      0,
    ];
  },

  addCommands() {
    return {
      toggleBulletList: () => props => {
        return commonToggleList({
          editor: this.editor,
          options: this.options,
          name: this.name,
          props,
        });
      },
    };
  },

  addKeyboardShortcuts() {
    return {
      'Mod-Shift-8': () => this.editor.commands.toggleBulletList(),
    };
  },

  addInputRules() {
    let inputRule = wrappingInputRule({
      find: inputRegex,
      type: this.type,
    });

    if (this.options.keepMarks || this.options.keepAttributes) {
      inputRule = wrappingInputRule({
        find: inputRegex,
        type: this.type,
        keepMarks: this.options.keepMarks,
        keepAttributes: this.options.keepAttributes,
        getAttributes: () => {
          return this.editor.getAttributes(TextStyle.name);
        },
        editor: this.editor,
      });
    }
    return [inputRule];
  },
});
export default BulletList;
