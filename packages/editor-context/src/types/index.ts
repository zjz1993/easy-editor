import type {JSONContent} from '@tiptap/core';
import type {IImageProps} from './imageProps.ts';
import type {CSSProperties} from "react";
import type {ExportProps} from "./exportProps.ts";

export type AlignType = 'left' | 'center' | 'right';

export type TEasyEditorProps = {
  outputHTML?: boolean;
  title?: string;
  content?: string | JSONContent;
  maxCount?: number;
  onChange?: (data: string | JSONContent) => void;
  placeholder?: string;
  autoFocus?: boolean;
  editable?: boolean;
  imageProps?: Partial<IImageProps>;
  exportProps?: Partial<ExportProps>;
  className?: string;
  style?: CSSProperties;
};
