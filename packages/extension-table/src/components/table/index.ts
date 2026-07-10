import type {TableOptions as OrigTableOptions} from '@tiptap/extension-table';
import {Table as TTable} from '@tiptap/extension-table';
import {CellSelection} from '@tiptap/pm/tables';
import {TableView} from "./TableView.ts";
import {columnResizing} from "../utils/TableResizePlugin.ts";
import {getSelectedCells} from '../utils/index.ts';

export type TableOptions = Partial<OrigTableOptions> & {
  cellMinWidth?: number;
};

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    cellBackground: {
      setCellBackground: (color: string) => ReturnType;
      unsetCellBackground: () => ReturnType;
    };
  }
}

export const Table = TTable.extend<TableOptions>({
  addOptions() {
    return {
      ...this.parent?.(),
      cellMinWidth: 100,
    };
  },
  addCommands() {
    return {
      ...this.parent?.(),
      setCellBackground:
        (color: string) =>
        ({ state, dispatch }) => {
          const { selection } = state;
          if (!(selection instanceof CellSelection)) return false;
          const cells = getSelectedCells(selection);
          if (!cells || cells.length === 0) return false;
          let tr = state.tr;
          cells.forEach(({ pos, node }) => {
            tr = tr.setNodeMarkup(pos, undefined, {
              ...node.attrs,
              background: color,
            });
          });
          if (dispatch) dispatch(tr);
          return true;
        },
      unsetCellBackground:
        () =>
        ({ state, dispatch }) => {
          const { selection } = state;
          if (!(selection instanceof CellSelection)) return false;
          const cells = getSelectedCells(selection);
          if (!cells || cells.length === 0) return false;
          let tr = state.tr;
          cells.forEach(({ pos, node }) => {
            const { background: _bg, ...rest } = node.attrs as Record<string, unknown>;
            tr = tr.setNodeMarkup(pos, undefined, rest);
          });
          if (dispatch) dispatch(tr);
          return true;
        },
    };
  },
  addProseMirrorPlugins() {
    const parentPlugins = this.parent?.() ?? [];
    return [
      ...parentPlugins.filter(
        //@ts-ignore
        p => !p.key.startsWith('custom_tableColumnResizing'),
      ),
      columnResizing({
        editor: this.editor,
        handleWidth: this.options.handleWidth,
        cellMinWidth: this.options.cellMinWidth,
        lastColumnResizable: this.options.lastColumnResizable,
      }),
      //tableEditing({
      //  allowTableNodeSelection: this.options.allowTableNodeSelection,
      //}),
    ];
  },
  addNodeView() {
    return ({ node }) => {
      return new TableView(node, this.options.cellMinWidth);
    };
  },
});
