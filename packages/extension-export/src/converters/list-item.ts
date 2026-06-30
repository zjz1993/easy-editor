import { Paragraph, type IParagraphOptions } from 'docx';

import { type DigitListItemNode, type ListItemNode } from '../types';
import { convertList } from './list';
import { convertParagraph } from './paragraph';

/**
 * Convert TipTap list item node to DOCX Paragraphs.
 *
 * A list item can contain multiple children:
 *   - paragraph(s) → the text content of the list item
 *   - nested list (bulletList / orderedList / unordered_list / ordered_list) → sub-list
 *
 * All children are converted and returned as a flat array of Paragraphs.
 *
 * @param nestingLevel - Current nesting depth; nested lists use nestingLevel+1.
 */
export async function convertListItem(
  node: ListItemNode | DigitListItemNode,
  options?: IParagraphOptions,
  nestingLevel: number = 0,
): Promise<Paragraph[]> {
  if (!node.content || node.content.length === 0) {
    return [new Paragraph(options || {})];
  }

  const paragraphs: Paragraph[] = [];

  for (const child of node.content) {
    if (child.type === 'paragraph') {
      const para = await convertParagraph(child, options);
      paragraphs.push(para);
    } else if (
      child.type === 'bulletList' ||
      child.type === 'orderedList' ||
      child.type === 'unordered_list' ||
      child.type === 'ordered_list'
    ) {
      const listType =
        child.type === 'orderedList' || child.type === 'ordered_list'
          ? ('ordered' as const)
          : ('bullet' as const);
      const nested = await convertList(
        child as any,
        listType,
        nestingLevel + 1,
      );
      paragraphs.push(...nested);
    }
  }

  return paragraphs;
}
