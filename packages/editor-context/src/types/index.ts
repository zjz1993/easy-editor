import type {JSONContent} from '@tiptap/core';
import type {IImageProps} from './imageProps.ts';

export type AlignType = 'left' | 'center' | 'right';

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
