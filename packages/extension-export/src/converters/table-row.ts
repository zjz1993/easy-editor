import { type TableCell, TableRow } from 'docx';

import { type TableRowNode } from '../types';
import { type TableContext } from './table';
import { convertTableCell } from './table-cell';
import { convertTableHeader } from './table-header';

/**
 * Convert TipTap table row node to DOCX TableRow
 *
 * @param node - TipTap standard 'tableRow' node
 * @param ctx - Table context (options + optional colWidths)
 */
export async function convertTableRow(
  node: TableRowNode,
  ctx: TableContext,
): Promise<TableRow> {
  // Choose row options
  const rowOptions = ctx.options?.row;

  const children: TableCell[] = [];

  const cells =
    (await Promise.all(
      node.content?.flatMap(async (cellNode) => {
        if (cellNode.type === 'tableCell') {
          return convertTableCell(cellNode, ctx.options);
        } else if (cellNode.type === 'tableHeader') {
          return await convertTableHeader(cellNode, ctx.options);
        }

        return [];
      }) || [],
    )) || [];

  children.push(...cells.flat());

  // Create table row with options
  const row = new TableRow({
    children,
    ...rowOptions,
  });

  return row;
}
