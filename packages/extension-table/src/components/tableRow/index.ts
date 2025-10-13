import {TableRow as TTableRow, type TableRowOptions as TTableRowOptions,} from '@tiptap/extension-table-row';

export type TableRowOptions = TTableRowOptions;

export const TableRow = TTableRow.extend<TTableRowOptions>({
  content: '(tableCell | tableHeader)*',
});
