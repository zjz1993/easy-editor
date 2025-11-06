import {Table as TTable} from '@tiptap/extension-table';
import {TableView} from "./TableView.ts";

export const Table = TTable.extend({
  addOptions() {
    return {
      cellMinWidth: 100,
    };
  },
  addNodeView() {
    return ({ node }) => {
      return new TableView(node, this.options.cellMinWidth);
    };
  },
});
