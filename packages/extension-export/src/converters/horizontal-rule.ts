import { BorderStyle, Paragraph } from 'docx';

import type { DocxOptions } from '../option';
import type { DividerNode, HorizontalRuleNode } from '../types';

/**
 * Convert TipTap horizontalRule / digit-editor divider node to DOCX Paragraph
 * Creates a horizontal line using bottom border
 *
 * @param node - TipTap horizontalRule or divider node
 * @param options - Docx options for horizontal rule styling
 * @returns DOCX Paragraph object with horizontal rule styling
 */
export function convertHorizontalRule(
  node: HorizontalRuleNode | DividerNode,
  options: DocxOptions['horizontalRule'],
): Paragraph {
  const isDivider = node.type === 'divider';

  return new Paragraph({
    children: [], // Empty content
    border: {
      bottom: {
        style: BorderStyle.SINGLE,
        size: 1,
        color: 'auto',
      },
    },
    // divider has 10px top/bottom margin in the editor (1px = 15 twip, 10px = 150 twip)
    ...(isDivider ? { spacing: { before: 150, after: 150 } } : {}),
    ...options?.paragraph,
  });
}
