import type { JSONContent } from '@tiptap/core';
import type {
  IImageOptions,
  IParagraphOptions,
  IPropertiesOptions,
  ISectionOptions,
  ITableCellOptions,
  ITableOfContentsOptions,
  ITableOptions,
  ITableRowOptions,
  OutputType,
} from 'docx';
import type { ExportProps } from '@textory/context';

/**
 * Options for generating DOCX documents
 */
export interface DocxOptions<T extends OutputType = OutputType> {
  // === IPropertiesOptions fields (in order) ===
  sections?: ISectionOptions[];
  title?: string;
  subject?: string;
  creator?: string;
  keywords?: string;
  description?: string;
  lastModifiedBy?: string;
  revision?: number;
  externalStyles?: IPropertiesOptions['externalStyles'];
  styles?: IPropertiesOptions['styles'];
  numbering?: IPropertiesOptions['numbering'];
  comments?: IPropertiesOptions['comments'];
  footnotes?: IPropertiesOptions['footnotes'];
  background?: IPropertiesOptions['background'];
  features?: IPropertiesOptions['features'];
  compatabilityModeVersion?: IPropertiesOptions['compatabilityModeVersion'];
  compatibility?: IPropertiesOptions['compatibility'];
  customProperties?: IPropertiesOptions['customProperties'];
  evenAndOddHeaderAndFooters?: IPropertiesOptions['evenAndOddHeaderAndFooters'];
  defaultTabStop?: IPropertiesOptions['defaultTabStop'];
  fonts?: IPropertiesOptions['fonts'];
  hyphenation?: IPropertiesOptions['hyphenation'];

  // === Specific options ===
  tableOfContents?: {
    title?: string;
    run?: Partial<ITableOfContentsOptions>;
  };

  image?: {
    paragraph?: Partial<IParagraphOptions>;
    run?: Pick<
      IImageOptions,
      'transformation' | 'floating' | 'altText' | 'outline'
    >;
  };

  table?: {
    paragraph?: Partial<IParagraphOptions>;
    run?: Partial<ITableOptions>;
    row?: {
      paragraph?: Partial<IParagraphOptions>;
      run?: Partial<ITableRowOptions>;
    };
    cell?: {
      paragraph?: Partial<IParagraphOptions>;
      run?: Partial<ITableCellOptions>;
    };
    header?: {
      paragraph?: Partial<IParagraphOptions>;
      run?: Partial<ITableCellOptions>;
    };
  };

  details?: {
    summary?: {
      paragraph?: Partial<IParagraphOptions>;
    };
    content?: {
      paragraph?: Partial<IParagraphOptions>;
    };
  };

  horizontalRule?: {
    paragraph?: Partial<IParagraphOptions>;
  };

  /**
   * Watermark configuration.
   * Supports text watermarks (rendered to image) or custom image watermarks.
   */
  watermark?: {
    /** Text content for the watermark (e.g. "CONFIDENTIAL", "DRAFT") */
    text?: string;
    /** Custom image URL or base64 data URL for watermark (overrides text) */
    image?: string;
    /** Font size for text watermark (default: 52) */
    fontSize?: number;
    /** Font color in hex, no # prefix (default: "C0C0C0") */
    color?: string;
    /** Font family (default: "Microsoft YaHei") */
    fontFamily?: string;
    /** Rotation angle in degrees, counter-clockwise (default: 315, i.e. diagonal) */
    rotation?: number;
    /** Opacity 0-1 (default: 0.3) */
    opacity?: number;
  };

  // Export options
  outputType: T;
}

/**
 * Export options for the public exportWORD API.
 */
export interface ExportOptions extends Partial<ExportProps>{
  data?: {
    title?: string;
    content?: JSONContent;
  };
}
