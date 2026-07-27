import { parseDocx } from './docxParser';
import type { DocxToHTMLOptions, ImageUploadHandler } from './types';

/**
 * Convert a .docx ArrayBuffer to clean HTML via the in-house parser.
 *
 * Implementation lives in `./docxParser`. Mammoth was replaced because it
 * strips direct character formatting (color, highlight) by design — that
 * loses user intent on import. The custom parser keeps color, highlight,
 * bold, italic, underline, strike, headings, lists (incl. nesting),
 * tables, hyperlinks, and images (with width/height).
 *
 * `options.styleMap` is no longer supported; it only made sense for
 * mammoth's style mapping. The argument is still accepted for backwards
 * compatibility but ignored.
 *
 * @param arrayBuffer - The .docx file as an ArrayBuffer
 * @param options - Optional conversion options (image converter only)
 * @returns The generated HTML string
 */
export async function convertDocxToHTML(
  arrayBuffer: ArrayBuffer,
  options?: DocxToHTMLOptions,
): Promise<string> {
  return parseDocx(arrayBuffer, options);
}

/**
 * Convert a base64 string + MIME type into a File object.
 */
export function base64ToFile(base64: string, contentType: string): File {
  const byteCharacters = atob(base64);
  const byteArray = new Uint8Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteArray[i] = byteCharacters.charCodeAt(i);
  }
  const ext = contentType.split('/')[1]?.split(';')[0] || 'png';
  return new File([byteArray], `imported-image-${Date.now()}.${ext}`, {
    type: contentType,
  });
}

/**
 * Upload an image via the user's upload handler, wrapped in a Promise.
 *
 * Supports two handler styles (mirrors `imageProps.onImageUpload`):
 *   - **Return style**: handler returns `string` / `Promise<string>` —
 *     resolved directly to the URL.
 *   - **Callback style**: handler returns `void` and signals completion
 *     via `options.onSuccess` / `options.onError`.
 *
 * The handler's `onSuccess` body accepts `body.data` (URL string),
 * `body.data.url`, or a plain string for flexibility.
 *
 * A settled guard ensures whichever signal fires first wins; later
 * callbacks are ignored.
 */
export function uploadImage(
  handler: ImageUploadHandler,
  file: File,
): Promise<string> {
  return new Promise((resolve, reject) => {
    let settled = false;
    const resolveOnce = (url?: string) => {
      if (settled) return;
      settled = true;
      if (url) resolve(url);
      else reject(new Error('图片上传成功但未返回 URL'));
    };
    const rejectOnce = (err: unknown) => {
      if (settled) return;
      settled = true;
      reject(err instanceof Error ? err : new Error('图片上传失败'));
    };

    const option = {
      file: file as any,
      onSuccess: (body: any) => {
        const url =
          typeof body === 'string'
            ? body
            : typeof body?.data === 'string'
              ? body.data
              : body?.data?.url;
        resolveOnce(url);
      },
      onError: (event: any) => rejectOnce(event),
    };

    try {
      const ret = handler(option);
      if (typeof ret === 'string') {
        resolveOnce(ret);
      } else if (ret && typeof (ret as Promise<any>).then === 'function') {
        Promise.resolve(ret as Promise<string>).then(resolveOnce, rejectOnce);
      }
      // else void: wait for onSuccess/onError callback.
    } catch (err) {
      rejectOnce(err);
    }
  });
}

/**
 * Count the number of base64 (data:) images in an HTML string.
 * Used to warn the user when images are skipped due to a missing
 * upload handler.
 */
export function countDataImages(html: string): number {
  const matches = html.match(/<img[^>]+src="data:/gi);
  return matches ? matches.length : 0;
}
