import type {Editor} from '@tiptap/core'
import {Extension, isNodeEmpty} from '@tiptap/core'
import type {Node as ProsemirrorNode} from '@tiptap/pm/model'
import {Plugin, PluginKey} from '@tiptap/pm/state'
import {Decoration, DecorationSet} from '@tiptap/pm/view'
import {BLOCK_TYPES} from "@easy-editor/editor-common";

export interface PlaceholderOptions {
  emptyEditorClass: string;
  emptyNodeClass: string;
  placeholder:
    | ((PlaceholderProps: {
        editor: Editor;
        node: ProsemirrorNode;
        pos: number;
        hasAnchor: boolean;
      }) => string)
    | string;
  showOnlyWhenEditable: boolean;
  showOnlyCurrent: boolean;
  includeChildren: boolean;
}
export const Placeholder = Extension.create<PlaceholderOptions>({
  name: 'placeholder',

  addOptions() {
    return {
      emptyEditorClass: 'is-editor-empty',
      emptyNodeClass: 'is-empty',
      placeholder: 'Write something …',
      showOnlyWhenEditable: true,
      showOnlyCurrent: true,
      includeChildren: false,
    };
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('placeholder'),
        props: {
          decorations: ({ doc, selection }) => {
            const active =
              this.editor.isEditable || !this.options.showOnlyWhenEditable;
            const { anchor } = selection;
            const decorations: Decoration[] = [];

            if (!active) return null;

            const isNewEmpty = this.editor
              .getJSON()
              .content.every((node: any) => {
                if (node.type === BLOCK_TYPES.P) {
                  return !Array.isArray(node.content);
                }
                return node.content?.length === 0;
              });

            doc.descendants((node, pos) => {
              const hasAnchor = anchor >= pos && anchor <= pos + node.nodeSize;
              const isEmpty = !node.isLeaf && isNodeEmpty(node);

              if ((hasAnchor || !this.options.showOnlyCurrent) && isEmpty) {
                const classes = [this.options.emptyNodeClass];
                if (isNewEmpty) classes.push(this.options.emptyEditorClass);

                const decoration = Decoration.node(pos, pos + node.nodeSize, {
                  class: classes.join(' '),
                  'data-placeholder':
                    typeof this.options.placeholder === 'function'
                      ? this.options.placeholder({
                          editor: this.editor,
                          node,
                          pos,
                          hasAnchor,
                        })
                      : this.options.placeholder,
                });

                decorations.push(decoration);
              }

              return this.options.includeChildren;
            });

            return DecorationSet.create(doc, decorations);
          },
        },
      }),
    ];
  },
});
