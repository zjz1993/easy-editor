interface UploadProgressEvent extends Partial<ProgressEvent> {
  percent?: number;
}
export interface RcFile extends File {
  uid: string;
}
export type UploadRequestMethod =
  | 'POST'
  | 'PUT'
  | 'PATCH'
  | 'post'
  | 'put'
  | 'patch';
export interface UploadRequestError extends Error {
  status?: number;
  method?: UploadRequestMethod;
  url?: string;
}
export type UploadRequestFile =
  | Exclude<BeforeUploadFileType, File | boolean>
  | RcFile;
export type BeforeUploadFileType = File | Blob | boolean | string;
export interface IImagePropsUploadOption<T = any> {
  file: UploadRequestFile;
  onProgress?: (event: UploadProgressEvent, file?: UploadRequestFile) => void;
  onError?: (event: UploadRequestError | ProgressEvent, body?: T) => void;
  onSuccess?: (body: T, fileOrXhr?: UploadRequestFile | XMLHttpRequest) => void;
}
export type IImageProps = {
  max: number;
  minWidth: number;
  minHeight: number;
  maxFileSize: number;
  onImageBeforeUpload: (file: File, fileList: File[]) => boolean;
  onImageStartUpload: (fileList: File[]) => void;
  onImageEndUpload: (success: boolean, files?: File[]) => void;
  onImageUpload: (options: IImagePropsUploadOption) => void;
  onImagePaste: (url: string) => Promise<{ data: { id: string; url: string } }>;
};
