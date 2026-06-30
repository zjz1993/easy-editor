import { Paragraph } from 'docx';
import type {
  BulletListNode,
  DigitListItemNode,
  DigitOrderedListNode,
  ListItemNode,
  OrderedListNode,
  UnorderedListNode,
} from '../types';
import { convertListItem } from './list-item';
import { mapAlignment } from './paragraph';

export interface ListOptions {
  numbering: {
    reference: string;
    level: number;
  };
  start?: number;
}

export function convertBulletList(): ListOptions {
  return {
    numbering: {
      reference: 'bullet-list',
      level: 0,
    },
  };
}

export function convertOrderedList(
  node: OrderedListNode | DigitOrderedListNode,
): ListOptions {
  const start = node.attrs?.start || 1;

  return {
    numbering: {
      reference: 'ordered-list',
      level: 0,
    },
    start,
  };
}

type ListContainerNode =
  | BulletListNode
  | OrderedListNode
  | UnorderedListNode
  | DigitOrderedListNode;

/**
 * Convert list nodes (bullet or ordered) with proper numbering.
 *
 * @param nestingLevel - Current nesting depth (0 = top level). Used as the
 *   numbering level so nested lists get increasing indentation.
 */
export async function convertList(
  node: ListContainerNode,
  listType: 'bullet' | 'ordered',
  nestingLevel: number = 0,
): Promise<Paragraph[]> {
  if (!node.content) {
    return [];
  }

  const elements: Paragraph[] = [];

  // Get list options
  const listOptions =
    listType === 'bullet'
      ? convertBulletList()
      : convertOrderedList(node as OrderedListNode | DigitOrderedListNode);

  // Determine numbering reference based on start value
  let numberingReference = listOptions.numbering.reference;

  if (listType === 'ordered' && listOptions.start && listOptions.start !== 1) {
    numberingReference = `ordered-list-start-${listOptions.start}`;
  }

  // Map alignment from list node attrs
  const alignment = mapAlignment(
    (node.attrs as { align?: 'left' | 'center' | 'right' | 'justify' | null })
      ?.align,
  );

  // Convert list items (support both standard 'listItem' and digit-editor 'list_item')
  for (const item of node.content) {
    if (item.type === 'listItem' || item.type === 'list_item') {
      const itemParagraphs = await convertListItem(
        item as ListItemNode | DigitListItemNode,
        {
          numbering: {
            reference: numberingReference,
            level: nestingLevel,
          },
          ...(alignment ? { alignment } : {}),
        },
        nestingLevel,
      );
      elements.push(...itemParagraphs);
    }
  }

  return elements;
}
