import type {ComponentProps} from 'react';
import {Upload} from '@textory/editor-common';
import type {
  IFileProps,
  IFilePropsUploadOption,
  IImageProps,
  IImagePropsUploadOption,
} from '@textory/context';

/** Minimal rc-upload customRequest option shape (avoids deep-importing types). */
type CustomRequestOption = Parameters<
  NonNullable<ComponentProps<typeof Upload>['customRequest']>
>[0];

/**
 * Adapt an `onImageUpload` / `onFileUpload` handler (which may return
 * `void`, `string`, or `Promise<string>`) into an rc-upload-compatible
 * `customRequest` that always signals completion via `option.onSuccess` /
 * `option.onError`.
 *
 * - Return style: `string` / `Promise<string>` — await and call onSuccess.
 * - Callback style: `void` — assume the handler manages onSuccess/onError
 *   itself (legacy contract).
 *
 * Async rejections from the return style bubble up to Upload's outer
 * try/catch, which also forwards to `option.onError`.
 *
 * Extracted from `ImageButton` so `FileButton` can reuse the same adapter.
 */
export function makeCustomRequest(
  handler:
    | IImageProps['onImageUpload']
    | IFileProps['onFileUpload']
    | undefined,
): (option: CustomRequestOption) => void {
  return option => {
    if (!handler) return;
    const uploadOption = option as CustomRequestOption &
      (IImagePropsUploadOption & IFilePropsUploadOption);
    let settled = false;
    const markSettled = () => {
      settled = true;
    };

    try {
      const ret = handler(uploadOption) as unknown;
      // Return style: string | Promise<string>
      if (typeof ret === 'string') {
        markSettled();
        uploadOption.onSuccess?.({ data: ret } as any, uploadOption.file);
      } else if (ret != null && typeof (ret as Promise<unknown>).then === 'function') {
        Promise.resolve(ret as Promise<string>).then(
          url => {
            if (settled) return;
            markSettled();
            uploadOption.onSuccess?.({ data: url } as any, uploadOption.file);
          },
          err => {
            if (settled) return;
            markSettled();
            uploadOption.onError?.(err as Error);
          },
        );
      }
      // else void: caller owns the callback contract — do nothing.
    } catch (err) {
      if (!settled) {
        markSettled();
        uploadOption.onError?.(err as Error);
      }
    }
  };
}
