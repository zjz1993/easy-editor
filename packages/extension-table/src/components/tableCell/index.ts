import {TableCell as TTableCell, type TableCellOptions as TTableCellOptions,} from '@tiptap/extension-table';
import {mergeAttributes} from '@tiptap/core';
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
import {addColumn, addRow, CellSelection, selectedRect, TableMap} from '@tiptap/pm/tables';
import classNames from 'classnames';

// 共享的单元格背景色属性定义，TableHeader 也复用
export const cellBackgroundAttribute = {
  default: null as string | null,
  parseHTML: (el: HTMLElement) =>
    el.getAttribute('data-background-color') ||
    el.style.backgroundColor ||
    null,
  renderHTML: (attrs: { background?: string | null }) =>
    attrs.background
      ? {
          'data-background-color': attrs.background,
          style: `background-color: ${attrs.background}`,
        }
      : {},
};

export const TableCell = TTableCell.extend<TTableCellOptions>({
  addAttributes() {
    return {
      ...this.parent?.(),
      background: cellBackgroundAttribute,
    };
  },
  renderHTML({ HTMLAttributes }){
    return ['td', mergeAttributes(HTMLAttributes, { class: 'textory-table-cell' }), 0];
  },
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

            const map = TableMap.get(table.node);

            //map.map.forEach((cellPos, index) => {
            //  const cellNode = state.doc.nodeAt(cellPos);
            //  const row = Math.floor(index / map.width);
            //  const col = index % map.width;
            //
            //  console.log('cell at:', cellPos, 'row:', row, 'col:', col);
            //
            //  if (row === 0) {
            //    console.log('第一行单元格:', cellPos);
            //  }
            //  if (col === 0) {
            //    console.log('第一列单元格:', cellPos);
            //  }
            //});

            const firstColumnCells = getCellsInColumn(0, selection);
            if (firstColumnCells.length) {
              firstColumnCells.forEach(({ node, pos }, rowIndex) => {
                const cellRowIndex = rowIndex;
                const rowSelected = isRowSelected(cellRowIndex, selection);
                const isFirst = rowIndex === 0;
                if (isFirst) {
                  decorations.push(
                    Decoration.widget(pos + 1, () => {
                      const selected = isTableSelected(selection);
                      const className = classNames(
                        'grip-table',
                        selected && 'selected',
                      );
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
                  grip.className = `textory-table-tool-row${rowSelected ? ' selected' : ''}${isFirst ? ' first' : ''}${isLast ? ' last' : ''}`;

                  // 点击选中整行
                  const bar = document.createElement('span');
                  bar.className = 'textory-table-tool-row-item';
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
                      if (
                        target.classList.contains(
                          'textory-table-tool-row-item',
                        )
                      ) {
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
                  grip.className = `textory-table-tool-column${colSelected ? ' selected' : ''}${isFirst ? ' first' : ''}${isLast ? ' last' : ''}`;

                  const bar = document.createElement('span');
                  bar.className = 'textory-table-tool-column-item';
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

                    if (
                      target.classList.contains(
                        'textory-table-tool-column-item',
                      )
                    ) {
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

            // === 为每个单元格附加点击选中按钮 ===
            // 遍历整张表的所有 cell，挂一个 DOM 节点，点击后选中当前单元格
            const allCellOffsets = map.cellsInRect({
              left: 0,
              right: map.width,
              top: 0,
              bottom: map.height,
            });
            allCellOffsets.forEach(cellOffset => {
              const cellPos = cellOffset + table.start;
              decorations.push(
                Decoration.widget(cellPos + 1, () => {
                  const btn = document.createElement('span');
                  btn.className = 'textory-table-cell-select-btn';
                  btn.setAttribute('contenteditable', 'false');
                  btn.addEventListener('mousedown', event => {
                    event.preventDefault();
                    event.stopImmediatePropagation();
                    // 用最新的 editor.state，避免闭包内 state 过期
                    const editorState = this.editor.state;
                    const $cell = editorState.doc.resolve(cellPos);
                    this.editor.view.dispatch(
                      editorState.tr.setSelection(
                        new CellSelection($cell),
                      ),
                    );
                  });
                  return btn;
                }),
              );
            });

            return DecorationSet.create(doc, decorations);
          },
        },
      }),
    ];
  },
});
