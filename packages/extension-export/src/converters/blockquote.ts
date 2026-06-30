import { Paragraph } from 'docx';

import type { BlockquoteNode } from '../types';
import { mapAlignment } from './paragraph';
import { convertHardBreak, convertText } from './text';

/**
 * Convert TipTap blockquote node to array of DOCX Paragraphs
 * Each paragraph in blockquote is indented and styled
 *
 * @param node - TipTap blockquote node
 * @returns Array of DOCX Paragraph objects
 */
export function convertBlockquote(node: BlockquoteNode): Paragraph[] {
  if (!node.content) return [];

  return node.content.map((contentNode) => {
    if (contentNode.type === 'paragraph') {
      // Convert paragraph content
      const children =
        contentNode.content?.flatMap((node) => {
          if (node.type === 'text') {
            return convertText(node);
          }
          if (node.type === 'hardBreak') {
            return convertHardBreak();
          }

          return [];
        }) || [];

      // Map alignment from paragraph attrs
      const alignment = mapAlignment(contentNode.attrs?.align);

      // Create indented paragraph for blockquote
      const paragraph = new Paragraph({
        children,
        indent: {
          left: 720,
        },
        border: {
          left: {
            style: 'single',
          },
        },
        ...(alignment ? { alignment } : {}),
      });

      return paragraph;
    }

    // Handle other content types within blockquote
    // For now, return empty paragraph as fallback
    return new Paragraph({});
  });
}
