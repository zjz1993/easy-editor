import {type Editor, Extension} from '@tiptap/core';
import {ReactRenderer} from '@tiptap/react';
import Suggestion from '@tiptap/suggestion';

import {SlashMenu, type SlashMenuRef} from './SlashMenu';
import {SlashCommandRegistry} from './SlashCommandRegistry';
import {basicCommands} from './commands/index.ts';
import type {SlashItem} from './types';

export type {SlashItem};

export interface SlashCommandOptions {
  /** 菜单命令集合，整体替换默认的 basicCommands */
  items: SlashItem[];
  /** 触发字符 */
  char: string;
}

export const SlashCommand = Extension.create<SlashCommandOptions>({
  name: 'slashCommand',

  addOptions() {
    return {
      items: basicCommands,
      char: '/',
    };
  },

  addProseMirrorPlugins() {
    const registry = new SlashCommandRegistry();
    registry.registerMany(this.options.items);

    return [
      Suggestion({
        editor: this.editor,
        char: this.options.char,
        startOfLine: true,

        items: ({query}) => {
          return registry.search(query, {editor: this.editor});
        },

        command: ({editor, range, props}) => {
          props.command({
            editor,
            range,
          });
        },

        render: () => {
          let component: ReactRenderer<SlashMenuRef> | null = null;
          let unmount: (() => void) | null = null;

          return {
            onStart: (props) => {
              component = new ReactRenderer(SlashMenu, {
                props,
                editor: this.editor,
              });

              unmount = props.mount(component.element);
            },

            onUpdate: (props) => {
              component?.updateProps(props);
            },

            // Escape 由 @tiptap/suggestion 插件自身拦截并触发 onExit，无需在此处理
            onKeyDown: (props) => {
              return component?.ref?.onKeyDown(props) ?? false;
            },

            onExit: () => {
              unmount?.();
              unmount = null;

              component?.destroy();
              component = null;
            },
          };
        },
      }),
    ];
  },
});
