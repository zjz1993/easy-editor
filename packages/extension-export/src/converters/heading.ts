import { HeadingLevel, Paragraph } from 'docx';

import type { HeadingNode } from '../types';
import { mapAlignment } from './paragraph';
import { convertHardBreak, convertText } from './text';

/**
 * Convert TipTap heading node to DOCX paragraph
 *
 * @param node - TipTap heading node
 * @returns DOCX Paragraph object
 */
export function convertHeading(node: HeadingNode): Paragraph {
  // Get heading level
  const level: HeadingNode['attrs']['level'] = node?.attrs?.level;

  // Convert content using shared text converter
  const children =
    node.content?.flatMap((contentNode) => {
      if (contentNode.type === 'text') {
        return convertText(contentNode);
      }
      if (contentNode.type === 'hardBreak') {
        return convertHardBreak();
      }

      return [];
    }) || [];

  // Map to DOCX heading levels
  const headingMap: Record<
    HeadingNode['attrs']['level'],
    (typeof HeadingLevel)[keyof typeof HeadingLevel]
  > = {
    1: HeadingLevel.HEADING_1,
    2: HeadingLevel.HEADING_2,
    3: HeadingLevel.HEADING_3,
    4: HeadingLevel.HEADING_4,
    5: HeadingLevel.HEADING_5,
    6: HeadingLevel.HEADING_6,
  };

  // Map alignment from node attrs
  const alignment = mapAlignment(node.attrs?.align);

  // Create heading paragraph
  const paragraph = new Paragraph({
    children,
    heading: headingMap[level],
    spacing: {
      before: 240, // 12pt before heading
      after: 120, // 6pt after heading
      line: 360, // 1.5x line spacing
    },
    ...(alignment ? { alignment } : {}),
  });

  return paragraph;
}
