import type {JSONContent} from '@tiptap/core';
import type {UploadRequestOption} from "rc-upload/es/interface";

export type TDropDownRefProps = {
  toggleVisible: (visible: boolean) => void;
};

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
export type IImageProps = {
  max: number;
  maxFileSize: number;
  onImageBeforeUpload: (file: File, fileList: File[]) => boolean;
  onImageStartUpload: (fileList: File[]) => void;
  onImageEndUpload: (success: boolean, files?: File[]) => void;
  onImageUpload: (options: UploadRequestOption) => void;
  onImagePaste: (url: string) => Promise<{ data: { id: string; url: string } }>;
};
