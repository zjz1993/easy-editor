import type {JSONContent} from '@tiptap/core';
import type {Editor} from '@tiptap/core';
import type {IImagePropsUploadOption} from '@textory/context';

/**
 * The user-provided image upload handler (from `imageProps.onImageUpload`).
 * Supports both return style (`string | Promise<string>`) and callback
 * style (`void` + onSuccess/onError).
 */
export type ImageUploadHandler = (
  options: IImagePropsUploadOption,
) => void | string | Promise<string>;

/**
 * Callbacks for the import lifecycle.
 */
export interface ImportCallbacks {
  onImportStarted?: () => void;
  onImportComplete?: (json: JSONContent) => void;
  onImportFailed?: (error: Error) => void;
}

/**
 * Options for the high-level `importWORD` function.
 */
export interface ImportWORDOptions extends ImportCallbacks {
  /** The .docx file to import */
  file: File;
  /** The Tiptap editor instance to inject content into */
  editor: Editor;
  /**
   * Optional image upload handler. When provided, each image in the .docx
   * is uploaded and replaced with the remote URL. When omitted, images are
   * inlined as base64 — which the editor schema strips by default, so the
   * user is warned about skipped images.
   */
  imageUploadHandler?: ImageUploadHandler;
}

/**
 * A minimal, mammoth-agnostic image descriptor passed to `convertImage`.
 */
export interface MammothImage {
  contentType: string;
  readAsBase64String: () => Promise<string>;
  readAsArrayBuffer: () => Promise<ArrayBuffer>;
}

/**
 * Options for the low-level `docxToHTML` function.
 */
export interface DocxToHTMLOptions {
  /**
   * Custom mammoth style map(s) for mapping Word styles to HTML.
   * @see https://github.com/mwilliamson/mammoth.js
   * @deprecated Retained for backwards compatibility; no longer used
   * since the custom docx parser replaced mammoth.
   */
  styleMap?: string | string[];
  /**
   * Custom image converter. Receives each image and should return
   * `{ src }` with the URL to use in the resulting `<img>` tag.
   * If omitted, images are inlined as base64 data URIs.
   *
   * If this throws, the parser does NOT abort the whole import. The
   * image falls back to a base64 data URI inline and `onImageError`
   * is invoked (if provided) so callers can surface the failure.
   */
  convertImage?: (image: MammothImage) => Promise<{src: string}>;
  /**
   * Per-image error callback. Invoked once for every image whose
   * `convertImage` rejected. The image is still emitted (as a base64
   * data URI) so the rest of the document imports normally.
   */
  onImageError?: (error: Error, image: MammothImage) => void;
}
