import {MIN_COL_WIDTH} from '../const';
import {fill, isEmpty, isNull} from 'lodash-es';
//  @ts-ignore
import {Fragment} from '@tiptap/pm/model';

function createEmptyCells(cols: number, paragraph: any, cell: any) {
  const cellNodes = [];
  for (let cc = 0; cc < cols; cc++) {
    const paragraphNode = paragraph.create({});
    // 加入columnIndex 和 rowIndex
    const cellNode = cell.create(
      { columnIndex: cc },
      Fragment.from(paragraphNode),
    );
    cellNodes.push(cellNode);
  }
  return cellNodes;
}

function convertToTable(html: string, schema: any, editor: any) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const tableElement = doc.querySelector('table');

  if (!tableElement) {
    throw new Error('No table found in pasted content');
  }
  const rowsArray = Array.from(tableElement.rows);
  const cols: number[] = [];
  rowsArray.forEach(row => {
    cols.push(row.children.length);
  });
  const rows = rowsArray.map((row, index) => {
    const cellsArray = Array.from(row.cells);
    const cells = cellsArray.map((cell, index) => {
      const cellTexts = isNull(cell.textContent)
        ? ''
        : cell.textContent.trim() || '';
      const rowspanValue = !isNull(cell.getAttribute('rowspan'))
        ? Number(cell.getAttribute('rowspan'))
        : 1; // 获取 rowspan 属性值
      const colspanValue = !isNull(cell.getAttribute('colspan'))
        ? Number(cell.getAttribute('colspan'))
        : 1;
      //if (!cellTexts) {
      //  return null;
      //}
      if (!cellTexts) {
        const paragraphNode = schema.nodes.paragraph.create({});
        return schema.nodes.table_cell.createChecked(
          { columnIndex: index, colspan: colspanValue, rowspan: rowspanValue },
          Fragment.from(paragraphNode),
        );
      }
      const textNode = editor.schema.text(cellTexts);
      const paragraphNode = schema.nodes.paragraph.createChecked({}, textNode);
      return schema.nodes.table_cell.createChecked(
        { columnIndex: index, colspan: colspanValue, rowspan: rowspanValue },
        [paragraphNode],
      );
    });
    const filterCells = cells.filter(cell => cell !== null);
    // cols = filterCells.length;
    //return schema.nodes.table_row.createChecked(
    //  { rowIndex: index },
    //    isEmpty(filterCells) ? null : filterCells,
    //);
    return schema.nodes.table_row.createChecked(
      { rowIndex: index },
      isEmpty(filterCells)
        ? createEmptyCells(1, schema.nodes.paragraph, schema.nodes.table_cell)
        : filterCells,
    );
  });
  return schema.nodes.table.createChecked(
    { cols: fill(new Array(Math.max.apply(null, cols)), MIN_COL_WIDTH) },
    rows,
  );
}
export { convertToTable };
