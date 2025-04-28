import type {UploadRequestOption} from 'rc-upload/es/interface';

interface IImageProps {
  max: number;
  maxFileSize: number;
  onImageBeforeUpload: (file: File, fileList: File[]) => boolean;
  onImageStartUpload: (fileList: File[]) => void;
  onImageEndUpload: (success: boolean, files?: File[]) => void;
  onImageUpload: (options: UploadRequestOption) => void;
  onImagePaste: (url: string) => Promise<{ data: { id: string; url: string } }>;
}

export default IImageProps;
