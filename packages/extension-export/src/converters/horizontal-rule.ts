import { BorderStyle, LineRuleType, Paragraph } from 'docx';

import type { DocxOptions } from '../option';
import type { DividerNode, HorizontalRuleNode } from '../types';

// Editor's $divider-grey = rgba(31, 35, 41, 0.15). Word border color has no
// alpha channel, so we use the equivalent opaque hex blended on white.
// 31*0.15 + 255*0.85 ≈ 221 (0xDD), same calc for G/B → #DDDEDF.
const DIVIDER_DEFAULT_COLOR = 'DDDEDF';

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
  const borderColor = options?.color ?? (isDivider ? DIVIDER_DEFAULT_COLOR : 'auto');

  return new Paragraph({
    children: [], // Empty content
    border: {
      bottom: {
        style: BorderStyle.SINGLE,
        size: 1,
        color: borderColor,
      },
    },
    ...(isDivider
      ? {
          // Editor renders divider with ~8px margin top/bottom (root.scss:
          // `.textory-block-container > * { margin: 8px 0 }`, collapsed).
          // Mirror that in Word:
          //   - before/after 60 twip = 3pt ≈ 4px, total 8px (matches editor)
          //   - line: 20 + EXACT shrinks the empty paragraph to ~1pt so it
          //     doesn't add a full text-line of height around the border
          //   - contextualSpacing: true tells Word to collapse adjacent
          //     paragraph spacing instead of stacking before+after
          spacing: { before: 60, after: 60, line: 20, lineRule: LineRuleType.EXACT },
          contextualSpacing: true,
        }
      : {}),
    ...options?.paragraph,
  });
}
