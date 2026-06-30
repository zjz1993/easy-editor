import type {JSONContent} from '@tiptap/core';
import {
  convertInchesToTwip,
  Document,
  LevelFormat,
  Packer,
  Paragraph,
  TableOfContents,
  TextRun,
  AlignmentType,
} from 'docx';
import type {
  FileChild,
  ILevelsOptions,
  INumberingOptions,
  IPropertiesOptions,
  OutputByType,
  OutputType,
} from 'docx'

import {convertBlockquote} from './converters/blockquote';
import {convertCodeBlock} from './converters/code-block';
import {convertHeading} from './converters/heading';
import {convertHorizontalRule} from './converters/horizontal-rule';
import {convertImage} from './converters/image';
import {convertList} from './converters/list';
import {convertListItem} from './converters/list-item';
import {convertParagraph} from './converters/paragraph';
import {convertTable} from './converters/table';
import {convertTaskItem} from './converters/task-item';
import {convertTaskList} from './converters/task-list';
import {convertHardBreak} from './converters/text';
import type {DocxOptions} from './option';
import type {
  BlockquoteNode,
  BulletListNode,
  CodeBlockNode,
  DividerNode,
  HeadingNode,
  HorizontalRuleNode,
  ImageNode,
  ListItemNode,
  OrderedListNode,
  ParagraphNode,
  TableNode,
  TaskItemNode,
  TaskListNode,
} from './types';
import {createWatermarkHeader} from './watermark';

/**
 * Convert a single node to DOCX element(s)
 */
export async function convertNode(
  node: JSONContent,
  options: DocxOptions,
): Promise<FileChild | FileChild[] | null> {
  if (!node || !node.type) {
    return null;
  }

  switch (node.type) {
    case 'paragraph':
      return convertParagraph(node as ParagraphNode, undefined, options.image);

    case 'heading':
      return convertHeading(node as HeadingNode);

    case 'blockquote':
    case 'quote': // easy-editor 使用 'quote' 命名
      return convertBlockquote(node as BlockquoteNode);

    case 'codeBlock':
      return convertCodeBlock(node as CodeBlockNode);

    case 'image':
      return await convertImage(node as ImageNode, options.image);

    case 'table':
      return await convertTable(node as TableNode, options.table);

    case 'bulletList':
    case 'unorderedList': // easy-editor 使用 'unorderedList' 命名
      return convertList(node as BulletListNode, 'bullet');

    case 'orderedList':
      return convertList(node as OrderedListNode, 'ordered');

    case 'taskList':
      return convertTaskList(node as TaskListNode);

    case 'listItem':
      return await convertListItem(node as ListItemNode);

    case 'taskItem':
      return convertTaskItem(node as TaskItemNode);

    case 'hardBreak':
      // Wrap hardBreak in a paragraph
      return new Paragraph({children: [convertHardBreak()]});

    case 'horizontalRule':
    case 'divider': // easy-editor 使用 'divider' 命名
      return convertHorizontalRule(
        node as HorizontalRuleNode | DividerNode,
        options.horizontalRule,
      );

    default:
      // Unknown node type, return a paragraph with text
      return new Paragraph({
        children: [new TextRun({text: `[Unsupported: ${node.type}]`})],
      });
  }
}

/**
 * Convert document content to DOCX elements
 */
export async function convertDocumentContent(
  node: JSONContent,
  options: DocxOptions,
): Promise<{ sections: Array<{ children: FileChild[] }> }> {
  const children: FileChild[] = [];

  if (!node || !Array.isArray(node.content)) {
    return {sections: [{children: []}]};
  }

  for (const childNode of node.content) {
    const element = await convertNode(childNode, options);

    if (Array.isArray(element)) {
      children.push(...element);
    } else if (element) {
      children.push(element);
    }
  }

  return {sections: [{children}]};
}

/**
 * Create numbering options for the document
 */
function createNumberingOptions(docJson: JSONContent): INumberingOptions {
  // Collect all unique ordered list start values
  const orderedListStarts = new Set<number>();

  function collectListStarts(node: JSONContent) {
    if (node.type === 'orderedList' && node.attrs?.start) {
      orderedListStarts.add(node.attrs.start);
    }

    if (node.content) {
      for (const child of node.content) {
        collectListStarts(child);
      }
    }
  }

  collectListStarts(docJson);

  // Build numbering options — support up to 8 nesting levels
  const MAX_LEVEL = 8;
  const bulletLevels: ILevelsOptions[] = [];
  const orderedLevels: ILevelsOptions[] = [];
  const bulletChars = ['•', '◦', '▪', '–', '●', '○', '■', '□'];

  for (let lvl = 0; lvl < MAX_LEVEL; lvl++) {
    const leftIndent = convertInchesToTwip(0.25 + 0.5 * lvl);
    const hanging = convertInchesToTwip(0.25);

    bulletLevels.push({
      level: lvl,
      format: LevelFormat.BULLET,
      text: bulletChars[lvl] || '•',
      alignment: AlignmentType.START,
      style: {
        paragraph: {
          indent: {left: leftIndent, hanging},
        },
      },
    });

    orderedLevels.push({
      level: lvl,
      format: LevelFormat.DECIMAL,
      text: `%${lvl + 1}.`,
      alignment: AlignmentType.START,
      style: {
        paragraph: {
          indent: {left: leftIndent, hanging},
        },
      },
    });
  }

  // Create the final numbering options
  const numberingOptions: Array<{
    reference: string;
    levels: ILevelsOptions[];
  }> = [
    {
      reference: 'bullet-list',
      levels: bulletLevels,
    },
    {
      reference: 'ordered-list',
      levels: orderedLevels,
    },
  ];

  // Add options for custom start values (with multi-level support)
  for (const start of Array.from(orderedListStarts)) {
    if (start !== 1) {
      const customLevels: ILevelsOptions[] = [];
      for (let lvl = 0; lvl < MAX_LEVEL; lvl++) {
        customLevels.push({
          level: lvl,
          format: LevelFormat.DECIMAL,
          text: `%${lvl + 1}.`,
          alignment: AlignmentType.START,
          ...(lvl === 0 ? {start} : {}),
          style: {
            paragraph: {
              indent: {
                left: convertInchesToTwip(0.25 + 0.5 * lvl),
                hanging: convertInchesToTwip(0.25),
              },
            },
          },
        });
      }
      numberingOptions.push({
        reference: `ordered-list-start-${start}`,
        levels: customLevels,
      });
    }
  }

  return {config: numberingOptions};
}

/**
 * Convert TipTap JSONContent to DOCX format
 *
 * @param docJson - TipTap document JSON
 * @param options - Options for document properties
 * @returns Promise with DOCX in specified format
 */
export async function generateDOCX<T extends OutputType>(
  docJson: JSONContent,
  options: DocxOptions<T>,
): Promise<OutputByType[T]> {
  const {
    // Document metadata
    title,
    subject,
    creator,
    keywords,
    description,
    lastModifiedBy,
    revision,

    // Document styling
    styles,

    // Table of contents
    tableOfContents,

    // Document options
    sections,
    fonts,
    hyphenation,
    compatibility,
    customProperties,
    evenAndOddHeaderAndFooters,
    defaultTabStop,

    // Export options
    outputType,
  } = options;

  // Convert document content to sections
  const {sections: contentSections} = await convertDocumentContent(
    docJson,
    options,
  );

  // Create table of contents if configured
  const tocElement = tableOfContents
    ? new TableOfContents(tableOfContents.title, {
      ...tableOfContents.run,
    })
    : null;

  // Collect ordered list start values for numbering options
  const numberingOptions = createNumberingOptions(docJson);

  // Build title paragraph if title is provided
  const titleParagraph = title
    ? new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: {after: 200},
      children: [
        new TextRun({
          text: title,
          bold: true,
          size: 44, // 22pt
          font: 'Microsoft YaHei',
        }),
      ],
    })
    : null;

  // Build document sections - merge user config with generated content
  let documentSections: Array<{ children: FileChild[] } | any>;

  // Create watermark header if configured
  const watermarkHeader = await createWatermarkHeader(options.watermark);

  if (sections) {
    // User provided custom sections - merge with content
    documentSections = sections.map((section, index) => {
      const sectionChildren: FileChild[] = [];

      // Add table of contents to first section if configured
      if (index === 0 && tocElement) {
        sectionChildren.push(tocElement);
      }

      // Add title at the top of the first section
      if (index === 0 && titleParagraph) {
        sectionChildren.unshift(titleParagraph);
      }

      // Add content sections to first user section
      if (index === 0) {
        contentSections.forEach((contentSection) => {
          sectionChildren.push(...contentSection.children);
        });
      }

      return {
        ...section,
        ...(sectionChildren.length > 0 ? {children: sectionChildren} : {}),
        ...(watermarkHeader && !section.headers?.default
          ? {headers: {...section.headers, default: watermarkHeader}}
          : {}),
      };
    });
  } else {
    // No custom sections - use content sections directly
    documentSections = [...contentSections];

    // Add title at the top of the document
    if (titleParagraph && documentSections.length > 0) {
      documentSections[0].children.unshift(titleParagraph);
    }

    // Add table of contents to first section if configured
    if (tocElement && documentSections.length > 0) {
      documentSections[0].children.unshift(tocElement);
    }

    // Add watermark header to all sections
    if (watermarkHeader) {
      documentSections = documentSections.map((section: any) => ({
        ...section,
        headers: {...section.headers, default: watermarkHeader},
      }));
    }
  }

  // Build document options
  const docOptions: IPropertiesOptions = {
    // Sections - required
    sections: documentSections,

    // Metadata
    title: title || 'Document',
    subject: subject || '',
    creator: creator || '',
    keywords: keywords || '',
    description: description || '',
    lastModifiedBy: lastModifiedBy || '',
    revision: revision || 1,

    // Styling
    styles,
    numbering: numberingOptions,
  };

  // Add optional properties only if provided
  if (fonts && fonts.length > 0) {
    Object.assign(docOptions, {fonts});
  }

  if (hyphenation) {
    Object.assign(docOptions, {hyphenation});
  }

  if (compatibility) {
    Object.assign(docOptions, {compatibility});
  }

  if (customProperties && customProperties.length > 0) {
    Object.assign(docOptions, {customProperties});
  }

  if (evenAndOddHeaderAndFooters !== undefined) {
    Object.assign(docOptions, {evenAndOddHeaderAndFooters});
  }

  if (defaultTabStop !== undefined) {
    Object.assign(docOptions, {defaultTabStop});
  }

  const doc = new Document(docOptions);
  return await Packer.pack(doc, outputType || 'arraybuffer') as unknown as Promise<
    OutputByType[T]
  >;
}
