import mammoth from 'mammoth';

import type {
  DocxToHTMLOptions,
  ImageUploadHandler,
  MammothImage,
} from './types';

/**
 * Convert a .docx ArrayBuffer to clean HTML using mammoth.
 *
 * mammoth strips Word-specific markup (`mso-*` styles, `<o:p>` tags, etc.)
 * and produces semantic HTML that maps directly to the editor's schema
 * (headings, lists, tables, blockquotes, etc.).
 *
 * @param arrayBuffer - The .docx file as an ArrayBuffer
 * @param options - Optional conversion options (style map, image converter)
 * @returns The generated HTML string
 */
export async function convertDocxToHTML(
  arrayBuffer: ArrayBuffer,
  options?: DocxToHTMLOptions,
): Promise<string> {
  const mammothOptions: Parameters<typeof mammoth.convertToHtml>[1] = {};

  if (options?.styleMap) {
    mammothOptions.styleMap = options.styleMap;
  }

  if (options?.convertImage) {
    // Wrap the user's convertImage callback with mammoth's imgElement adapter
    mammothOptions.convertImage = mammoth.images.imgElement(
      async (image) => {
        const mammothImage: MammothImage = {
          contentType: image.contentType,
          readAsBase64String: () => image.readAsBase64String(),
          readAsArrayBuffer: () => image.readAsArrayBuffer(),
        };
        return options.convertImage!(mammothImage);
      },
    );
  } else {
    // Default: inline images as base64 data URIs.
    // The editor schema strips data: URLs by default, so callers that
    // want images should pass a convertImage / imageUploadHandler.
    mammothOptions.convertImage = mammoth.images.dataUri;
  }

  const result = await mammoth.convertToHtml({arrayBuffer}, mammothOptions);
  return result.value;
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
 * Upload an image via the user's callback-based upload handler,
 * wrapped in a Promise.
 *
 * The handler's `onSuccess` receives the response body. The existing
 * `ImageButton` convention is `body.data` = URL string, but we also
 * handle `body.data.url` and plain string responses for flexibility.
 */
export function uploadImage(
  handler: ImageUploadHandler,
  file: File,
): Promise<string> {
  return new Promise((resolve, reject) => {
    handler({
      file: file as any,
      onSuccess: (body: any) => {
        const url =
          typeof body === 'string'
            ? body
            : typeof body?.data === 'string'
              ? body.data
              : body?.data?.url;
        if (url) {
          resolve(url);
        } else {
          reject(new Error('图片上传成功但未返回 URL'));
        }
      },
      onError: (event: any) => {
        reject(event instanceof Error ? event : new Error('图片上传失败'));
      },
    });
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
