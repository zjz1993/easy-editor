import {TableCell as TTableCell, type TableCellOptions as TTableCellOptions,} from '@tiptap/extension-table';
import {Plugin, PluginKey} from '@tiptap/pm/state';
import {Decoration, DecorationSet} from '@tiptap/pm/view';
import {
  findTable,
  getCellsInColumn,
  getCellsInRow,
  isColumnSelected,
  isRowSelected,
  isTableSelected,
  selectRow,
  toggleSelectTable,
} from '../utils/index.ts';
import {addColumn, addRow, selectedRect} from '@tiptap/pm/tables';

export const TableCell = TTableCell.extend<TTableCellOptions>({
  addProseMirrorPlugins() {
    const pluginKey = new PluginKey('tableCellControlBtn');
    return [
      new Plugin({
        key: pluginKey,
        props: {
          decorations: state => {
            if (!this.editor.isEditable) {
              return DecorationSet.empty;
            }
            const { doc, selection } = state;
            const decorations: Decoration[] = [];
            const table = findTable(selection);
            if (!table) return DecorationSet.empty;
            const firstColumnCells = getCellsInColumn(0, selection);
            if (firstColumnCells.length) {
              firstColumnCells.forEach(({ node, pos }, rowIndex) => {
                const cellRowIndex = rowIndex;
                const rowSelected = isRowSelected(cellRowIndex, selection);
                const isFirst = rowIndex === 0;
                if (isFirst) {
                  decorations.push(
                    Decoration.widget(pos + 1, () => {
                      let className = 'grip-table';
                      const selected = isTableSelected(selection);
                      if (selected) {
                        className += ' selected';
                      }
                      const grip = document.createElement('a');
                      grip.className = className;
                      grip.addEventListener('mousedown', event => {
                        event.preventDefault();
                        event.stopImmediatePropagation();
                        this.editor.view.dispatch(
                          toggleSelectTable(this.editor.state),
                        );
                      });
                      return grip;
                    }),
                  );
                }
                const isLast = rowIndex === firstColumnCells.length - 1;
                const deco = Decoration.widget(pos + 1, () => {
                  const grip = document.createElement('a');
                  grip.className = `grip-row${rowSelected ? ' selected' : ''}${isFirst ? ' first' : ''}${isLast ? ' last' : ''}`;

                  // 点击选中整行
                  const bar = document.createElement('span');
                  bar.className = 'bar';
                  grip.appendChild(bar);

                  // + 按钮：上方插入
                  if (isFirst) {
                    const addBefore = document.createElement('span');
                    addBefore.className = 'add before';
                    addBefore.textContent = '+';
                    grip.appendChild(addBefore);
                  }

                  // + 按钮：下方插入
                  const addAfter = document.createElement('span');
                  addAfter.className = 'add after';
                  addAfter.textContent = '+';
                  grip.appendChild(addAfter);

                  grip.addEventListener(
                    'mousedown',
                    event => {
                      event.preventDefault();
                      event.stopImmediatePropagation();

                      const rect = selectedRect(state);
                      const target = event.target as HTMLElement;
                      console.log('target是', target);
                      if (target.classList.contains('bar')) {
                        this.editor.view.dispatch(selectRow(rowIndex, state));
                      } else if (target.classList.contains('before')) {
                        this.editor.view.dispatch(
                          addRow(state.tr, rect, cellRowIndex),
                        );
                      } else if (target.classList.contains('after')) {
                        const rowspan =
                          Number.parseInt(node.attrs.rowspan) || 1;
                        this.editor.view.dispatch(
                          addRow(state.tr, rect, cellRowIndex + rowspan),
                        );
                      }
                    },
                    true,
                  );

                  return grip;
                });

                decorations.push(deco);
              });
            }

            // === 渲染第一行控制器（列控制栏） ===
            const firstRowCells = getCellsInRow(0, selection);
            if (firstRowCells.length) {
              firstRowCells.forEach(({ node, pos }, colIndex) => {
                const cellColumnIndex = colIndex;
                const colSelected = isColumnSelected(colIndex, selection);
                const isFirst = colIndex === 0;
                const isLast = colIndex === firstRowCells.length - 1;
                const deco = Decoration.widget(pos + 1, () => {
                  const grip = document.createElement('a');
                  grip.className = `grip-column${colSelected ? ' selected' : ''}${isFirst ? ' first' : ''}${isLast ? ' last' : ''}`;

                  const bar = document.createElement('span');
                  bar.className = 'bar';
                  grip.appendChild(bar);

                  // + 按钮：左侧插入
                  if (isFirst) {
                    const addBefore = document.createElement('span');
                    addBefore.className = 'add before';
                    addBefore.textContent = '+';
                    grip.appendChild(addBefore);
                  }

                  // + 按钮：右侧插入
                  const addAfter = document.createElement('span');
                  addAfter.className = 'add after';
                  addAfter.textContent = '+';
                  grip.appendChild(addAfter);

                  grip.addEventListener('mousedown', event => {
                    event.preventDefault();
                    event.stopImmediatePropagation();

                    const rect = selectedRect(state);
                    const target = event.target as HTMLElement;

                    if (target.classList.contains('bar')) {
                      this.editor.view.dispatch(
                        selectRow(cellColumnIndex, state, 'col').setMeta(
                          pluginKey,
                          {
                            active: { type: 'col', index: colIndex },
                          },
                        ),
                      );
                    } else if (target.classList.contains('before')) {
                      this.editor.view.dispatch(
                        addColumn(state.tr, rect, cellColumnIndex),
                      );
                    } else if (target.classList.contains('after')) {
                      const colspan = Number.parseInt(node.attrs.colspan) || 1;
                      this.editor.view.dispatch(
                        addColumn(state.tr, rect, cellColumnIndex + colspan),
                      );
                    }
                  });

                  return grip;
                });

                decorations.push(deco);
              });
            }

            return DecorationSet.create(doc, decorations);
          },
        },
      }),
    ];
  },
});
