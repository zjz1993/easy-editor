import type {JSONContent} from '@tiptap/core';
import type IImageProps from './image.ts';

export type TEasyEditorProps = {
  title?: string;
  content?: string | JSONContent;
  maxCount?: number;
  onChange?: (data: string | JSONContent) => void;
  placeholder?: string;
  autoFocus?: boolean;
  editable?: boolean;
  imageProps?: Partial<IImageProps>;
};
export type { IImageProps };
