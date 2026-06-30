import { Paragraph, Table, type ITableOptions } from 'docx';

import { type DocxOptions } from '../option';
import { type TableNode } from '../types';
import { convertTableRow } from './table-row';

export interface TableContext {
  options: DocxOptions['table'];
  /** Column widths from table.attrs.cols (digit-editor) */
  colWidths?: number[];
}

function toDxaWidths(colWidths?: number[]): number[] | undefined {
  if (!colWidths?.length) return undefined;
  return colWidths.map((width) => width * 15);
}

/**
 * Convert TipTap table node to DOCX Table
 *
 * @param node - TipTap table node
 * @param options - Table options from PropertiesOptions
 * @returns Array containing Table and a following Paragraph to prevent merging
 */
export async function convertTable(
  node: TableNode,
  options: DocxOptions['table'],
): Promise<Array<Table | Paragraph>> {
  // Build table context with column widths
  const ctx: TableContext = {
    options,
    colWidths: node.attrs?.cols,
  };

  // Convert table rows sequentially
  const rows = [];
  for (const row of node.content || []) {
    const converted = await convertTableRow(row, ctx);
    rows.push(converted);
  }

  // Build table options with options
  const tableOptions: ITableOptions = {
    rows,
    columnWidths: toDxaWidths(ctx.colWidths),
    // Set default table width if not specified
    width: {
      size: options?.run?.width?.size || 100,
      type: options?.run?.width?.type || 'pct',
    },
    // Use fixed layout to ensure cell widths are respected
    // This is important when we set specific widths on cells
    layout: options?.run?.layout || 'fixed',
    ...options?.run, // Apply table options
  };

  // Create table
  const table = new Table(tableOptions);

  // Return table with a following empty paragraph to prevent automatic merging with adjacent tables
  return [table, new Paragraph({})];
}
