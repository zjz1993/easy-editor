import {
  AlignmentType,
  Paragraph,
  TextRun,
  type IParagraphOptions,
} from 'docx';

import { type DocxOptions } from '../option';
import { type ParagraphNode, type VideoNode } from '../types';
import { convertImageRun } from './image';
import { convertHardBreak, convertText } from './text';
// import { convertEmoji } from './emoji';

/**
 * Map editor alignment value to docx AlignmentType
 */
export function mapAlignment(
  align?: 'left' | 'center' | 'right' | 'justify' | null,
): (typeof AlignmentType)[keyof typeof AlignmentType] | undefined {
  if (!align || align === 'left') return undefined;
  const map: Record<
    string,
    (typeof AlignmentType)[keyof typeof AlignmentType]
  > = {
    center: AlignmentType.CENTER,
    right: AlignmentType.RIGHT,
    justify: AlignmentType.JUSTIFIED,
  };
  return map[align];
}

/**
 * Convert TipTap paragraph node to DOCX Paragraph
 *
 * @param node - TipTap paragraph node
 * @param options - Optional paragraph options (e.g., numbering)
 * @returns DOCX Paragraph object
 */
export async function convertParagraph(
  node: ParagraphNode,
  options?: IParagraphOptions,
  imageOptions?: DocxOptions['image'],
): Promise<Paragraph> {
  // Convert content to text runs
  const childrenPromises =
    node.content?.map(async (contentNode) => {
      if (contentNode.type === 'text') {
        return convertText(contentNode);
      } else if (contentNode.type === 'hardBreak') {
        return convertHardBreak();
      } else if (contentNode.type === 'image') {
        return convertImageRun(contentNode, imageOptions);
      } else if (contentNode.type === 'video') {
        const videoNode = contentNode as VideoNode;
        const videoName = videoNode.attrs?.name || '未知视频';
        return new TextRun({ text: `[_${videoName}]` });
      }
      /**
       * else if (contentNode.type === 'emoji') {
       *         return await convertEmoji(contentNode);
       *       }
       * */

      return null;
    }) || [];

  // Wait for all conversions to complete
  const children = (await Promise.all(childrenPromises)).filter(
    (child): child is Exclude<typeof child, null> => child !== null,
  );

  // Map alignment from node attrs
  const alignment = mapAlignment(node.attrs?.align);

  // Create paragraph with options
  const paragraphOptions: IParagraphOptions = {
    children,
    spacing: {
      line: 360, // 1.5x line spacing
      after: 120, // 6pt after paragraph
    },
    ...(alignment ? { alignment } : {}),
    ...options,
  };

  return new Paragraph(paragraphOptions);
}
