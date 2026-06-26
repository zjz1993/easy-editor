import {TableRow as TTableRow, type TableRowOptions as TTableRowOptions,} from '@tiptap/extension-table-row';

export type TableRowOptions = TTableRowOptions;

export const TableRow = TTableRow.extend<TTableRowOptions>({
  content: '(tableCell | tableHeader)*',
  //addProseMirrorPlugins() {
  //  return [
  //    new Plugin({
  //      key: new PluginKey('tableRow'),
  //      props: {
  //        decorations: state => {
  //          const { doc, selection } = state;
  //          const decorations: Decoration[] = [];
  //          const table = findTable(selection);
  //          if (!table) return DecorationSet.empty;
  //          table.node.descendants((node, pos) => {
  //            if (node.type.name === 'tableRow') {
  //              const deco = Decoration.widget(pos + 1, () => {
  //                const line = document.createElement('div');
  //                line.className = 'line';
  //                return line;
  //              });
  //              decorations.push(deco);
  //              console.log('行node是', node, pos);
  //            }
  //          });
  //          return DecorationSet.create(doc, decorations);
  //        },
  //      },
  //    }),
  //  ];
  //},
});
