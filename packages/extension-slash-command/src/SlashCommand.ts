import {type Editor, Extension} from '@tiptap/core'
import { ReactRenderer } from '@tiptap/react'
import Suggestion from '@tiptap/suggestion'

import { SlashMenu, type SlashMenuRef } from './SlashMenu'
import {SlashCommandRegistry} from "./SlashCommandRegistry";
import {basicCommands} from "./commands/index.ts";

export interface SlashItem {
  id: string;
  title: string
  description: string
  keywords?: string[]
  visible?: (context: {
    editor: Editor
  }) => boolean
  command: ({ editor, range }: {
    editor: any
    range: { from: number; to: number }
  }) => void
}

export const SlashCommand = Extension.create({
  name: 'slashCommand',

  addProseMirrorPlugins() {
    const slashRegistry = new SlashCommandRegistry();
    slashRegistry.registerMany(basicCommands);
    return [
      Suggestion({
        editor: this.editor,
        char: '/',
        startOfLine: true,

        items: ({ query }) => {
          return slashRegistry.search(query, {editor: this.editor});
        },

        command: ({ editor, range, props }) => {
          props.command({
            editor,
            range,
          })
        },

        render: () => {
          let component: ReactRenderer<SlashMenuRef> | null = null
          let unmount: (() => void) | null = null

          return {
            onStart: (props) => {
              component = new ReactRenderer(SlashMenu, {
                props,
                editor: this.editor,
              })

              unmount = props.mount(component.element)
            },

            onUpdate: (props) => {
              component?.updateProps(props)
            },

            onKeyDown: (props) => {
              if (props.event.key === 'Escape') {
                return true
              }

              return component?.ref?.onKeyDown(props) ?? false
            },

            onExit: () => {
              unmount?.()
              unmount = null

              component?.destroy()
              component = null
            },
          }
        },
      }),
    ]
  },
})
