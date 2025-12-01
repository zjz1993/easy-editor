import {Table as TTable} from '@tiptap/extension-table';
import {TableView} from "./TableView.ts";
import {columnResizing} from "../utils/TableResizePlugin.ts";
import '../../styles/index.scss';
import {tableEditing} from '@tiptap/pm/tables';

const tableResizerPlugin: any = null;

export const Table = TTable.extend({
  addOptions() {
    return {
      cellMinWidth: 100,
    };
  },
  addProseMirrorPlugins() {
    return [
      columnResizing({
        editor: this.editor,
        handleWidth: this.options.handleWidth,
        cellMinWidth: this.options.cellMinWidth,
        lastColumnResizable: this.options.lastColumnResizable,
      }),
      tableEditing({
        allowTableNodeSelection: this.options.allowTableNodeSelection,
      }),
    ];
  },
  addNodeView() {
    return ({ node }) => {
      return new TableView(node, this.options.cellMinWidth);
    };
  },
});
