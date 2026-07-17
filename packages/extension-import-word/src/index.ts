import {message} from '@textory/editor-common-ui';

import {
  base64ToFile,
  convertDocxToHTML,
  countDataImages,
  uploadImage,
} from './converter';
import type {DocxToHTMLOptions, ImportWORDOptions} from './types';

/**
 * Convert a .docx file to clean HTML.
 *
 * This is the low-level conversion function with no Tiptap dependency.
 * Use this if you want to handle the HTML yourself (preview, custom
 * cleaning, etc.). For the full editor-injection pipeline, use
 * {@link importWORD} instead.
 *
 * @param input - A `File` or `ArrayBuffer` of the .docx
 * @param options - Optional conversion options
 * @returns The generated HTML string
 */
export async function docxToHTML(
  input: File | ArrayBuffer,
  options?: DocxToHTMLOptions,
): Promise<string> {
  const arrayBuffer = input instanceof File ? await input.arrayBuffer() : input;
  return convertDocxToHTML(arrayBuffer, options);
}

/**
 * Import a .docx file into the editor, replacing the entire document.
 *
 * The pipeline:
 * 1. Read the file as ArrayBuffer
 * 2. mammoth converts it to semantic HTML
 * 3. Each image is uploaded via `imageUploadHandler` (if provided)
 * 4. `editor.commands.setContent(html)` replaces the document
 *
 * When no `imageUploadHandler` is provided, images are inlined as base64.
 * The editor's image schema rejects `data:` URLs by default, so those
 * images are stripped and the user is warned.
 *
 * @param options - Import configuration
 */
export async function importWORD(options: ImportWORDOptions): Promise<void> {
  const {
    file,
    editor,
    imageUploadHandler,
    onImportStarted,
    onImportComplete,
    onImportFailed,
  } = options;

  onImportStarted?.();

  try {
    // Validate file type — mammoth only supports .docx, not legacy .doc
    if (!file.name.toLowerCase().endsWith('.docx')) {
      throw new Error('仅支持 .docx 格式，不支持 .doc 或其他格式');
    }

    const arrayBuffer = await file.arrayBuffer();

    // Build convertImage: upload via handler if available, else inline base64
    const html = await convertDocxToHTML(arrayBuffer, {
      convertImage: imageUploadHandler
        ? async (image) => {
            const base64 = await image.readAsBase64String();
            const imgFile = base64ToFile(base64, image.contentType);
            const remoteUrl = await uploadImage(imageUploadHandler, imgFile);
            return {src: remoteUrl};
          }
        : undefined,
    });

    // Warn about skipped images when no upload handler is configured
    if (!imageUploadHandler) {
      const skipped = countDataImages(html);
      if (skipped > 0) {
        message.warning(
          `未配置图片上传功能，${skipped} 张图片已跳过`,
        );
      }
    }

    // Replace entire document content
    editor.commands.setContent(html, {emitUpdate: true});

    onImportComplete?.(editor.getJSON());
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    onImportFailed?.(err);
    message.error(`导入 Word 文档失败: ${err.message}`);
  }
}

export type {
  DocxToHTMLOptions,
  ImportCallbacks,
  ImportWORDOptions,
  MammothImage,
} from './types';
