export type IImageProps = {
  max: number;
  minWidth: number;
  minHeight: number;
  maxFileSize: number;
  onImageBeforeUpload: (file: File, fileList: File[]) => boolean;
  onImageStartUpload: (fileList: File[]) => void;
  onImageEndUpload: (success: boolean, files?: File[]) => void;
  onImageUpload: (options: any) => void;
  onImagePaste: (url: string) => Promise<{ data: { id: string; url: string } }>;
};
