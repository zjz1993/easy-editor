import { TableCell } from 'docx';

import { type DocxOptions } from '../option';
import { type TableHeaderNode } from '../types';
import { convertParagraph } from './paragraph';

function normalizeCellWidth(
  colwidth: number[] | null | undefined,
): number | undefined {
  if (!Array.isArray(colwidth) || colwidth.length === 0) return undefined;
  return colwidth.reduce((sum, width) => sum + width, 0) * 15;
}

/**
 * Convert TipTap table header node to DOCX TableCell
 *
 * @param node - TipTap table header node
 * @param options - Table options from PropertiesOptions
 * @returns DOCX TableCell object for header
 */
export async function convertTableHeader(
  node: TableHeaderNode,
  options: DocxOptions['table'],
): Promise<TableCell> {
  // Convert paragraphs in the header
  const paragraphs = await Promise.all(
    node.content?.map((p) =>
      convertParagraph(
        p,
        options?.header?.paragraph ??
          options?.cell?.paragraph ??
          options?.row?.paragraph ??
          options?.paragraph,
      ),
    ) || [],
  );

  // Create table header cell with header options
  const headerCell = new TableCell({
    children: paragraphs,
    ...options?.header?.run,
  });

  // Add column span if present
  if (node.attrs?.colspan && node.attrs.colspan > 1) {
    Object.assign(headerCell.options, { columnSpan: node.attrs.colspan });
  }

  // Add row span if present
  // Add column width if present
  const explicitWidth = normalizeCellWidth(node.attrs?.colwidth);
  if (explicitWidth) {
    Object.assign(headerCell.options, {
      width: {
        size: explicitWidth,
        type: 'dxa' as const,
      },
    });
  }

  if (!headerCell.options.width) {
    Object.assign(headerCell.options, {
      width: {
        size: 2000, // Default width of about 1.4 inches (2000/1440)
        type: 'dxa' as const,
      },
    });
  }

  return headerCell;
}
