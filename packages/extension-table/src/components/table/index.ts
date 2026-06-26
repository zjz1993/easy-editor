import type {TableOptions as OrigTableOptions} from '@tiptap/extension-table';
import {Table as TTable} from '@tiptap/extension-table';
import {TableView} from "./TableView.ts";
import {columnResizing} from "../utils/TableResizePlugin.ts";

export type TableOptions = Partial<OrigTableOptions> & {
  cellMinWidth?: number;
};

export const Table = TTable.extend<TableOptions>({
  addOptions() {
    return {
      ...this.parent?.(),
      cellMinWidth: 100,
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
