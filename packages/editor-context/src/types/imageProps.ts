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
  /**
   * MUST be invoked when the upload fails. If the implementor swallows the
   * error (e.g. try/catch without forwarding), the editor's image node will
   * be stuck in the "uploading" state and never flip to `isError`.
   *
   * Implementors that simply `throw` on failure are also supported: the
   * Upload wrapper awaits `onImageUpload` and converts rejected promises
   * into an `onError` call automatically.
   */
  onError?: (event: UploadRequestError | ProgressEvent, body?: T) => void;
  onSuccess?: (body: T, fileOrXhr?: UploadRequestFile | XMLHttpRequest) => void;
}
export type IImageProps = {
  minWidth: number;
  minHeight: number;
  maxFileSize: number;
  onImageBeforeUpload: (file: File, fileList: File[]) => boolean;
  onImageStartUpload: () => void;
  onImageEndUpload: () => void;
  /**
   * Custom upload implementation. Two supported calling styles:
   *
   * 1. **Return style** (preferred): return `string` or `Promise<string>`
   *    containing the uploaded URL. The editor resolves it for you.
   *    ```ts
   *    onImageUpload: async ({ file }) => {
   *      const fd = new FormData();
   *      fd.append('file', file);
   *      const res = await fetch('/api/upload', { method: 'POST', body: fd });
   *      return (await res.json()).url;
   *    }
   *    ```
   *
   * 2. **Callback style** (legacy): return `void` and signal completion
   *    by calling `options.onSuccess` / `options.onError` / `options.onProgress`.
   *
   * In both styles, any thrown / rejected error is automatically forwarded
   * to `options.onError` (and thus to the editor's image node, which flips
   * to `isError`).
   */
  onImageUpload: (
    options: IImagePropsUploadOption,
  ) => void | string | Promise<string>;
  onImagePaste: (url: string) => Promise<{ data: { id: string; url: string } }>;
};
export type ImageNodeAttributes = {
  /** `undefined` is allowed to support error-placeholder nodes (no src). */
  src?: string;
  alt?: string;
  title?: string;
  width?: number;
  height?: number;
  textAlign?: 'center' | 'left' | 'right';
  id?: string;
  /**
   * Internal upload-tracking key. Independent of `id` because plugins
   * such as `@tiptap/extension-unique-id` rewrite `id` after insertion,
   * breaking the upload pipeline's lookups.
   */
  uploadKey?: string;
  hasBorder?: boolean;
  isError?: boolean;
};

/**
 * Upload option shape for file uploads. Mirrors `IImagePropsUploadOption`
 * because the upload contract (return string | Promise<string>, or use
 * callbacks) is identical — only the file kind differs.
 */
export interface IFilePropsUploadOption<T = any>
  extends IImagePropsUploadOption<T> {}

/**
 * Props for the file-attachment feature, parallel to `IImageProps`.
 *
 * Differences vs image:
 * - `accept`: HTML file-input accept string (e.g. `.pdf,.docx`).
 * - No dimension-related fields (images need `minWidth`/`minHeight`,
 *   files don't).
 * - No paste-URL handler equivalent to `onImagePaste`.
 */
export type IFileProps = {
  /**
   * HTML file-input `accept` attribute. Use `*` (default) for no
   * restriction, or a comma-separated list of extensions / MIME types.
   */
  accept?: string;
  /** Max file size in KB. Files larger than this are rejected pre-upload. */
  maxFileSize: number;
  onFileBeforeUpload: (file: File, fileList: File[]) => boolean;
  onFileStartUpload: () => void;
  onFileEndUpload: () => void;
  /**
   * Custom upload implementation. Same two calling styles as
   * `IImageProps.onImageUpload`:
   *
   * 1. Return `string` / `Promise<string>` containing the uploaded URL.
   * 2. Return `void` and call `options.onSuccess` / `onError` / `onProgress`
   *    manually (legacy contract).
   */
  onFileUpload: (
    options: IFilePropsUploadOption,
  ) => void | string | Promise<string>;
};

export type FileNodeAttributes = {
  /** Download URL. Empty during upload; populated on upload success. */
  src?: string;
  /** File name, including extension. */
  name?: string;
  /** File size in bytes. */
  size?: number;
  /** Lower-cased extension without the dot, e.g. `pdf`, `docx`. */
  ext?: string;
  /** @see ImageNodeAttributes.uploadKey */
  uploadKey?: string;
  id?: string;
  isError?: boolean;
};
