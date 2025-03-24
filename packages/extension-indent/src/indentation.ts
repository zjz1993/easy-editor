import { isUndefined } from '@easy-editor/editor-common';
import { Extension, findParentNodeClosestToPos } from '@tiptap/core';
import {
  AllSelection,
  TextSelection,
  type Transaction,
} from '@tiptap/pm/state';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    indentation: {
      /**
       * Set the indent attribute
       */
      indent: (options?: { delta?: number }) => ReturnType;

      /**
       * Unset the indent attribute
       */
      outdent: (options?: {
        delta?: number;
        backspace?: boolean;
      }) => ReturnType;
    };
  }
}

function clamp(val: number, min: number, max: number): number {
  if (val < min) {
    return min;
  }
  if (val > max) {
    return max;
  }
  return val;
}

export type IndentationOptions = {
  types: string[];
  itemTypeName?: string;
  disabledTypes: string[];
  disabledGroups: string[];
  minLevel: number;
  maxLevel: number;
};

export const Indent = Extension.create<IndentationOptions>({
  name: 'indentation',

  addOptions() {
    return {
      types: ['paragraph', 'heading', 'codeBlock'],
      disabledTypes: ['table'],
      disabledGroups: ['list'],
      minLevel: 0,
      maxLevel: 8,
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          indent: {
            default: 0,
            renderHTML: attributes => {
              return attributes?.indent > this.options.minLevel
                ? Object.assign({}, { 'data-indent': attributes.indent })
                : null;
            },
            parseHTML: element => {
              const indent = element.getAttribute('data-indent');
              const level = indent ? Number.parseInt(indent) : 0;
              return level &&
                level > this.options.minLevel &&
                level <= this.options.maxLevel
                ? level
                : 0;
            },
            keepOnSplit: true,
          },
        },
      },
    ];
  },

  addCommands() {
    const setNodeIndentMarkup = (
      tr: Transaction,
      pos: number,
      delta: number,
    ) => {
      const node = tr?.doc?.nodeAt(pos);
      if (node) {
        const { minLevel, maxLevel } = this.options;
        const indent = clamp(
          (node.attrs.indent || 0) + delta,
          minLevel,
          maxLevel,
        );
        if (indent !== node.attrs.indent) {
          const nodeAttrs = {
            ...node.attrs,
            indent,
          }; // 给行添加首行缩进属性
          return tr.setNodeMarkup(pos, node.type, nodeAttrs, node.marks);
        }
      }
      return tr;
    };

    const updateIndentLevel = (tr: Transaction, delta: number) => {
      const { doc, selection } = tr;
      if (
        doc &&
        selection &&
        (selection instanceof TextSelection ||
          selection instanceof AllSelection)
      ) {
        const { from, to } = selection;
        doc.nodesBetween(
          from,
          to,
          (node: { type: { name: string } }, pos: number) => {
            const disabledNode = findParentNodeClosestToPos(
              tr.doc.resolve(pos),
              node =>
                this.options.disabledGroups.some(
                  group =>
                    (node.type.spec.group as any)?.split(' ').indexOf(group) >
                    -1,
                ) || this.options.disabledTypes.indexOf(node.type.name) > -1,
            );
            if (
              !disabledNode &&
              this.options.types.indexOf(node.type.name) > -1
            ) {
              tr = setNodeIndentMarkup(tr, pos, delta);
              return false;
            }
            return true;
          },
        );
      }
      return tr;
    };

    return {
      indent:
        ({ delta = 1 } = {}) =>
        ({ tr, state, dispatch }) => {
          const { selection } = state;
          tr = tr.setSelection(selection);

          const newTr = updateIndentLevel(tr, delta);
          if (newTr.docChanged) {
            if (dispatch) dispatch(newTr);
            return true;
          }

          return isUndefined(dispatch);
        },
      outdent:
        ({ delta = -1, backspace = false } = {}) =>
        ({ tr, state, dispatch }) => {
          const { selection } = state;

          // backspace
          if (
            backspace &&
            (selection.$anchor.parentOffset > 0 ||
              selection.from !== selection.to)
          ) {
            return false;
          }

          tr = tr.setSelection(selection);
          tr = updateIndentLevel(tr, delta);

          if (tr.docChanged) {
            if (dispatch) dispatch(tr);
            return true;
          }

          return isUndefined(dispatch);
        },
    };
  },

  addKeyboardShortcuts() {
    return {
      Tab: () => this.editor.commands.indent(),
      'Shift-Tab': () => this.editor.commands.outdent(),
      Backspace: () => this.editor.commands.outdent({ backspace: true }),
    };
  },
});
