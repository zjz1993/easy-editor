import {findParentNode} from '@tiptap/core';
import {type EditorState, type Selection, TextSelection, type Transaction,} from '@tiptap/pm/state';
import {CellSelection, TableMap} from '@tiptap/pm/tables';
import {DOMSerializer} from 'prosemirror-model';
import {smartClipboardCopy} from '@easy-editor/editor-common';
import type {EditorView} from '@tiptap/pm/view';
import {currentColWidth, updateColumnWidth} from './TableResizePlugin.ts'; // 寻找table
// 寻找table
export type CustomTableMap = {
  pos: number;
  start: number;
  node: any;
};

export const findTable = (selection: Selection) =>
  findParentNode(
    node => node.type.spec.tableRole && node.type.spec.tableRole === 'table',
  )(selection);
// 获取某列的单元格
export const getCellsInColumn = (
  columnIndex: number | number[],
  selection: Selection,
): CustomTableMap[] => {
  const table = findTable(selection);
  if (!table) return [];
  const map = TableMap.get(table.node);
  const indexes = Array.isArray(columnIndex) ? columnIndex : [columnIndex];

  return indexes.flatMap(index => {
    if (index < 0 || index >= map.width) return [];
    const cells = map.cellsInRect({
      left: index,
      right: index + 1,
      top: 0,
      bottom: map.height,
    });
    return cells.map(nodePos => {
      const node = table.node.nodeAt(nodePos);
      const pos = nodePos + table.start;
      return { pos, start: pos + 1, node };
    });
  });
};
// 获取某行的单元格
export const getCellsInRow = (
  rowIndex: number | number[],
  selection: Selection,
): CustomTableMap[] => {
  const table = findTable(selection);
  if (!table) return [];

  const map = TableMap.get(table.node);
  const indexes = Array.isArray(rowIndex) ? rowIndex : [rowIndex];

  return indexes.flatMap(index => {
    if (index < 0 || index >= map.height) return [];
    const cells = map.cellsInRect({
      left: 0,
      right: map.width,
      top: index,
      bottom: index + 1,
    });
    return cells.map(nodePos => {
      const node = table.node.nodeAt(nodePos);
      const pos = nodePos + table.start;
      return { pos, start: pos + 1, node };
    });
  });
};

export const shouldShowTableMenu = ({ editor, view, state, from, to }) => {
  const { selection } = state;

  // 1️⃣ 必须是 CellSelection
  if (!(selection instanceof CellSelection)) return false;

  // 2️⃣ 确保表格节点还存在
  const $anchor = selection.$anchorCell;
  const tableNode = $anchor.node($anchor.depth - 1);
  return !(!tableNode || tableNode.type.name !== 'table');
};

export const isCellSelection = (selection: any) => {
  return selection instanceof CellSelection;
};

export const isRectSelected = (rect: any) => (selection: CellSelection) => {
  const map = TableMap.get(selection.$anchorCell.node(-1));
  const start = selection.$anchorCell.start(-1);
  const cells = map.cellsInRect(rect);
  const selectedCells = map.cellsInRect(
    map.rectBetween(
      selection.$anchorCell.pos - start,
      selection.$headCell.pos - start,
    ),
  );

  for (let i = 0, count = cells.length; i < count; i++) {
    if (selectedCells.indexOf(cells[i]) === -1) {
      return false;
    }
  }

  return true;
};

export const isRowSelected = (rowIndex: number, selection: Selection) => {
  if (isCellSelection(selection)) {
    const map = TableMap.get(selection.$anchorCell.node(-1));
    return isRectSelected({
      left: 0,
      right: map.width,
      top: rowIndex,
      bottom: rowIndex + 1,
    })(selection);
  }

  return false;
};

export const isColumnSelected = (columnIndex: number, selection: Selection) => {
  if (isCellSelection(selection)) {
    const map = TableMap.get(selection.$anchorCell.node(-1));
    return isRectSelected({
      left: columnIndex,
      right: columnIndex + 1,
      top: 0,
      bottom: map.height,
    })(selection);
  }

  return false;
};

export function selectRow(
  rowIndex: number,
  state: EditorState,
  type: 'row' | 'col' = 'row',
): Transaction | null {
  const table = findTable(state.tr.selection);
  if (!table) return state.tr;

  const map = TableMap.get(table.node);
  const isRow = type === 'row';

  if (rowIndex < 0 || rowIndex >= (isRow ? map.height : map.width))
    return state.tr;

  const rect = {
    left: isRow ? 0 : rowIndex,
    top: isRow ? rowIndex : 0,
    right: isRow ? map.width : rowIndex + 1,
    bottom: isRow ? rowIndex + 1 : map.height,
  };

  const cells = map.cellsInRect(rect);
  if (!cells.length) return state.tr;

  const tableStart = table.start;
  const from = tableStart + cells[0];
  const to = tableStart + cells[cells.length - 1];
  const $from = state.tr.doc.resolve(from);
  const $to = state.tr.doc.resolve(to);

  return state.tr.setSelection(new CellSelection($from, $to));
}
export const getSelectedCells = (selection: any) => {
  if (isCellSelection(selection)) {
    const table = findTable(selection);
    const map = TableMap.get(selection.$anchorCell.node(-1));
    const start = selection.$anchorCell.start(-1);
    const selectedCells = map.cellsInRect(
      map.rectBetween(
        selection.$anchorCell.pos - start,
        selection.$headCell.pos - start,
      ),
    );
    return selectedCells.map(nodePos => {
      const node = table.node.nodeAt(nodePos);
      const pos = nodePos + table.start;
      return { pos, start: pos + 1, node };
    });
  }
  return null;
};
export const isTableSelected = (selection: any) => {
  if (isCellSelection(selection)) {
    const map = TableMap.get(selection.$anchorCell.node(-1));
    return isRectSelected({
      left: 0,
      right: map.width,
      top: 0,
      bottom: map.height,
    })(selection);
  }

  return false;
};

export function toggleSelectTable(state: EditorState): Transaction | null {
  const { selection, tr } = state;
  const table = findTable(selection);
  if (!table) return null;

  const map = TableMap.get(table.node);

  // === 判断当前是否已经选中整表 ===
  if (isTableFullySelected(state)) {
    // 如果已经整表选中，就取消选中，返回光标放在第一个单元格中
    const firstCellPos =
      table.start +
      map.cellsInRect({
        left: 0,
        top: 0,
        right: 1,
        bottom: 1,
      })[0];
    const $pos = state.doc.resolve(firstCellPos + 1);
    return tr.setSelection(TextSelection.near($pos)).scrollIntoView();
  }

  // === 否则选中整个表格 ===
  const allCells = map.cellsInRect({
    left: 0,
    right: map.width,
    top: 0,
    bottom: map.height,
  });

  const firstCellPos = table.start + allCells[0];
  const lastCellPos = table.start + allCells[allCells.length - 1];

  const $firstCell = tr.doc.resolve(firstCellPos);
  const $lastCell = tr.doc.resolve(lastCellPos);

  return tr
    .setSelection(new CellSelection($firstCell, $lastCell))
    .scrollIntoView();
}

function isTableFullySelected(state: EditorState): boolean {
  const { selection } = state;
  if (!(selection instanceof CellSelection)) return false;

  const table = findTable(selection);
  if (!table) return false;

  const map = TableMap.get(table.node);
  const allCells = map.cellsInRect({
    left: 0,
    right: map.width,
    top: 0,
    bottom: map.height,
  });
  const selectedCells = map.cellsInRect(
    map.rectBetween(
      selection.$anchorCell.pos - table.start,
      selection.$headCell.pos - table.start,
    ),
  );

  return allCells.length === selectedCells.length;
}

export function serializeTableNodeToHTML(tableNode, schema) {
  // DOMSerializer.fromSchema(schema) 返回一个序列化器
  const serializer = DOMSerializer.fromSchema(schema);
  // serializeNode 会返回一个 DOM node（例如 <table>...</table>）
  const dom = serializer.serializeNode(tableNode);

  // 把它包装到一个临时 div 中取 innerHTML
  const wrapper = document.createElement('div');
  wrapper.appendChild(dom);
  return wrapper.innerHTML;
}

export async function copyTableToClipboard(view: any) {
  const { state } = view;
  const table = findTable(state.selection);
  if (!table) return false;
  const html = serializeTableNodeToHTML(table.node, state.schema);
  const text = table.node.textContent || '';
  await smartClipboardCopy(html, text);
  return html;
}
// 获取整表的宽度
export const getTableWidth = (view: EditorView) => {
  const { state } = view;
  const table = findTable(state.selection);
  if (!table) return 0;
  const dom: any = view.domAtPos(table.start).node;
  if (!dom) return 0;
  return dom.getBoundingClientRect().width;
};

// 均分所选的列宽
export const equalizeWidth = (view: EditorView, posArray: number[]) => {
  const { state } = view;
  const table = findTable(state.selection);
  if (!table) {
    return 0;
  }
  let dom: any = view.domAtPos(table.start).node;
  console.log('dom', dom);
  while (dom && dom.nodeName !== 'TABLE') {
    dom = dom.parentNode;
  }
  if (!dom) return 0;
  const map = TableMap.get(table.node);
  let totalWidth = 0;
  for (let i = 0; i < map.width; i++) {
    console.log('map.map[i]', map.map[i] + 1);
    if (posArray.find(item => item === map.map[i] + 1)) {
      const cell = view.state.doc.nodeAt(map.map[i] + 1)!;
      const width = currentColWidth(view, map.map[i] + 1, cell.attrs);
      totalWidth += width;
    }
  }
  const width = totalWidth / posArray.length;
  for (let i = 0; i < map.width; i++) {
    if (posArray.find(item => item === map.map[i] + 1)) {
      updateColumnWidth(view, map.map[i] + 1, width);
    }
  }
  return totalWidth;
};
