import { TableCell } from 'docx';

import { type DocxOptions } from '../option';
import type { ImageNode, ParagraphNode, TableCellNode } from '../types';
import { convertImage } from './image';
import { convertParagraph } from './paragraph';

function normalizeCellWidth(
  colwidth: number[] | null | undefined,
): number | undefined {
  if (!Array.isArray(colwidth) || colwidth.length === 0) return undefined;
  return colwidth.reduce((sum, width) => sum + width, 0) * 15;
}

/**
 * Convert TipTap table cell node to DOCX TableCell
 *
 * @param node - TipTap table cell node
 * @param options - Table options from PropertiesOptions
 * @returns DOCX TableCell object
 */
export async function convertTableCell(
  node: TableCellNode,
  options: DocxOptions['table'],
): Promise<TableCell> {
  // Convert paragraphs in the cell
  const paragraphs =
    (await Promise.all(
      node.content?.map(async (p) => {
        // Handle image nodes
        if (p.type === 'image' || p.type === 'tableImage') {
          const imgNode = p as ImageNode;
          const [rawWidth, rawHeight] = imgNode.attrs?.size?.split('x') || [
            '100',
            '100',
          ];
          const width = Number(rawWidth);
          const height = Number(rawHeight);

          //  防止图片过大
          return convertImage(
            {
              ...imgNode,
              attrs: {
                ...imgNode.attrs,
                width: width > 1000 ? width * 0.4 : 100,
                height: height > 1000 ? height * 0.4 : 100,
              },
            } as ImageNode,
            undefined,
          );
        } else {
          // Handle paragraph nodes
          return convertParagraph(
            p as ParagraphNode,
            options?.cell?.paragraph ??
              options?.row?.paragraph ??
              options?.paragraph,
            undefined,
          );
        }
      }) || [],
    )) || [];

  // Create table cell with options
  const cell = new TableCell({
    children: paragraphs,
    ...options?.cell?.run,
  });

  // console.log('🚀 ~ file: table-cell.ts:39 ~ paragraphs:', paragraphs);

  // Add column span if present
  if (node.attrs?.colspan && node.attrs.colspan > 1) {
    Object.assign(cell.options, { columnSpan: node.attrs.colspan });
  }

  // Add row span if present
  // Add column width if present
  const explicitWidth = normalizeCellWidth(node.attrs?.colwidth);
  if (explicitWidth) {
    Object.assign(cell.options, {
      width: {
        size: explicitWidth,
        type: 'dxa' as const,
      },
    });
  }

  if (!cell.options.width) {
    Object.assign(cell.options, {
      width: {
        size: 2000, // Default width of about 1.4 inches (2000/1440)
        type: 'dxa' as const,
      },
    });
  }

  return cell;
}
