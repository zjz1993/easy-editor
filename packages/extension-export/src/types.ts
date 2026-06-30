import type { JSONContent } from '@tiptap/core';

// Re-export JSONContent for convenience
export type { JSONContent };

// Text and content node types
export interface TextNode {
  type: 'text';
  text: string;
  marks?: Array<Mark>;
}

export interface HardBreakNode {
  type: 'hardBreak';
  marks?: Array<Mark>;
}

// Mark types
export interface Mark {
  type:
    | 'bold'
    | 'italic'
    | 'underline'
    | 'strike'
    | 'code'
    | 'textStyle'
    | 'link'
    | 'highlight'
    | 'subscript'
    | 'superscript'
    | 'color'
    | 'background';
  attrs?: {
    color?: string;
    background?: string;
    href?: string;
    target?: string;
    rel?: string;
    class?: string | null;
    [key: string]: unknown;
  };
}

// Block node types
export interface DocumentNode extends JSONContent {
  type: 'doc';
  content?: Array<BlockNode>;
}

export interface ParagraphNode extends JSONContent {
  type: 'paragraph';
  attrs?: {
    align?: 'left' | 'center' | 'right' | 'justify' | null;
    [key: string]: unknown;
  };
  content?: Array<TextNode | HardBreakNode | EmojiNode | ImageNode | VideoNode>;
}

export interface VideoNode extends JSONContent {
  type: 'video';
  attrs?: {
    name?: string;
    [key: string]: unknown;
  };
}

export interface HeadingNode extends JSONContent {
  type: 'heading';
  attrs: {
    level: 1 | 2 | 3 | 4 | 5 | 6;
    align?: 'left' | 'center' | 'right' | 'justify' | null;
    [key: string]: unknown;
  };
  content?: Array<TextNode | HardBreakNode>;
}

export interface BlockquoteNode extends JSONContent {
  type: 'blockquote';
  content?: Array<ParagraphNode>;
}

export interface CodeBlockNode extends JSONContent {
  type: 'codeBlock';
  attrs?: {
    language?: string;
  };
  content?: Array<TextNode>;
}

export interface HorizontalRuleNode extends JSONContent {
  type: 'horizontalRule';
}

// digit-editor custom divider node (same visual as horizontalRule)
export interface DividerNode extends JSONContent {
  type: 'divider';
}

// List node types
export interface BulletListNode extends JSONContent {
  type: 'bulletList';
  content?: Array<ListItemNode>;
}

export interface OrderedListNode extends JSONContent {
  type: 'orderedList';
  attrs?: {
    start?: number;
    order?: number;
    type?: string | null;
  };
  content?: Array<ListItemNode>;
}

export interface TaskListNode extends JSONContent {
  type: 'taskList';
  content?: Array<TaskItemNode>;
}

export interface ListItemNode extends JSONContent {
  type: 'listItem';
  content?: Array<ParagraphNode>;
}

export interface TaskItemNode extends JSONContent {
  type: 'taskItem';
  attrs?: {
    checked?: boolean;
  };
  content?: Array<ParagraphNode>;
}

// digit-editor custom list node types
export interface UnorderedListNode extends JSONContent {
  type: 'unordered_list';
  content?: Array<DigitListItemNode>;
}

export interface DigitOrderedListNode extends JSONContent {
  type: 'ordered_list';
  attrs?: {
    start?: number;
    [key: string]: unknown;
  };
  content?: Array<DigitListItemNode>;
}

export interface DigitListItemNode extends JSONContent {
  type: 'list_item';
  content?: Array<ParagraphNode>;
}

// Check list node types (digit-editor custom naming for TaskList/TaskItem)
export interface CheckListNode extends JSONContent {
  type: 'check_list';
  content?: Array<CheckItemNode>;
}

export interface CheckItemNode extends JSONContent {
  type: 'check_item';
  attrs?: {
    checked?: boolean;
    align?: 'left' | 'center' | 'right' | 'justify' | null;
    [key: string]: unknown;
  };
  content?: Array<ParagraphNode>;
}

// Table node types
export interface TableNode extends JSONContent {
  type: 'table';
  attrs?: {
    cols?: number[];
    [key: string]: unknown;
  };
  content?: Array<TableRowNode>;
}

export interface TableRowNode extends JSONContent {
  type: 'tableRow';
  content?: Array<TableCellNode | TableHeaderNode>;
}

export interface TableCellNode extends JSONContent {
  type: 'tableCell';
  attrs?: {
    colspan?: number;
    rowspan?: number;
    colwidth?: number[] | null;
  };
  content?: Array<ParagraphNode | ImageNode>;
}

export interface TableHeaderNode extends JSONContent {
  type: 'tableHeader';
  attrs?: {
    colspan?: number;
    rowspan?: number;
    colwidth?: number[] | null;
  };
  content?: Array<ParagraphNode>;
}

// Image node type
export interface ImageNode extends JSONContent {
  type: 'image' | 'tableImage';
  attrs?: {
    src: string;
    alt?: string | null;
    title?: string | null;
    width?: number | null;
    height?: number | null;
    size?: string | null;
  };
}

// File attachment node type (digit-editor custom)
export interface FileNode extends JSONContent {
  type: 'file';
  attrs?: {
    size?: number;
    type?: string;
    url?: string;
    downloadUrl?: string;
    name?: string;
    fileKey?: string;
    background?: string | null;
  };
}

// Emoji node type
export interface EmojiNode extends JSONContent {
  type: 'emoji';
  attrs?: {
    id: string;
    name: string;
    emoji: string;
    fallbackImage?: string | null;
  };
}

// Details node types
export interface DetailsNode extends JSONContent {
  type: 'details';
  content?: Array<DetailsSummaryNode | DetailsContentNode>;
}

export interface DetailsSummaryNode extends JSONContent {
  type: 'detailsSummary';
  content?: Array<TextNode | HardBreakNode>;
}

export interface DetailsContentNode extends JSONContent {
  type: 'detailsContent';
  content?: Array<BlockNode>;
}

// Generic converter types
export type TextContent = TextNode | HardBreakNode;
export type BlockNode =
  | ParagraphNode
  | HeadingNode
  | BlockquoteNode
  | CodeBlockNode
  | HorizontalRuleNode
  | DividerNode
  | BulletListNode
  | OrderedListNode
  | UnorderedListNode
  | DigitOrderedListNode
  | TaskListNode
  | CheckListNode
  | TableNode
  | ImageNode
  | FileNode
  | EmojiNode
  | DetailsNode;

/**
 * 水印配置（对外 API 使用）
 */
export interface IExportWatermark {
  /** 水印文本（与 image 二选一） */
  text?: string;
  /** 水印图片 URL 或 base64（与 text 二选一） */
  image?: string;
  /** 字号（pt），默认 52 */
  fontSize?: number;
  /** 颜色（HEX 不带 #），默认 848a99 */
  color?: string;
  /** 字体，默认 Microsoft YaHei */
  fontFamily?: string;
  /** 旋转角度，默认 315 */
  rotation?: number;
  /** 不透明度 0-1，默认 0.3 */
  opacity?: number;
}
