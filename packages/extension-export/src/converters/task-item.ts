import { Paragraph, TextRun } from 'docx';

import { type TaskItemNode } from '../types';
import { mapAlignment } from './paragraph';
import { convertHardBreak, convertText } from './text';

/**
 * Convert TipTap task item node to DOCX Paragraph with checkbox
 *
 * @param node - TipTap task item node
 * @returns DOCX Paragraph object with checkbox
 */
export function convertTaskItem(node: TaskItemNode): Paragraph {
  if (!node.content || node.content.length === 0) {
    return new Paragraph({});
  }

  // Convert the first paragraph in the task item
  const firstParagraph = node.content[0];

  if (firstParagraph.type === 'paragraph') {
    // Add checkbox based on checked state
    const isChecked = node.attrs?.checked || false;
    const checkboxText = isChecked ? '☑ ' : '☐ ';

    // Convert paragraph content to text runs
    const children =
      firstParagraph.content?.flatMap((contentNode) => {
        if (contentNode.type === 'text') {
          return convertText(contentNode);
        } else if (contentNode.type === 'hardBreak') {
          return convertHardBreak();
        }

        return [];
      }) || [];

    // Add checkbox as first text run
    const checkboxRun = new TextRun({ text: checkboxText });

    // Map alignment from task item or its paragraph attrs
    const alignment =
      mapAlignment(
        (
          node.attrs as {
            align?: 'left' | 'center' | 'right' | 'justify' | null;
          }
        )?.align,
      ) ?? mapAlignment(firstParagraph.attrs?.align);

    return new Paragraph({
      children: [checkboxRun, ...children],
      ...(alignment ? { alignment } : {}),
    });
  }

  // Fallback to empty paragraph
  return new Paragraph({});
}
