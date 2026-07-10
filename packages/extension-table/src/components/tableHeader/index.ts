import {TableHeader as TTableHeader} from '@tiptap/extension-table-header';
import {cellBackgroundAttribute} from '../tableCell/index.ts';

export const TableHeader = TTableHeader.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      background: cellBackgroundAttribute,
    };
  },
});
