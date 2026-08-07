/**
 * 把简化版 upload 适配器（传 File 返 URL）转换为 React 版 imageProps / videoProps / fileProps 形态。
 *
 * 规则：
 * - 若用户已传 `imageProps.onImageUpload`（escape hatch），保留不动
 * - 若用户只传 `upload.image`，自动生成 `onImageUpload` 调用该函数
 * - 三套（image / video / file）各自独立判断
 *
 * video 略复杂：`upload.video` 可返回 `{ url, poster }`，需要分别注入 `onVideoUpload` 与 `onPosterUpload`。
 */
import type {
  IImageProps,
  IFileProps,
  IVideoProps,
} from '@textory/context';
import type {UploadAdapters, TextoryOptions} from './types';

/**
 * 输入用户的 `upload` + escape hatch props，输出合并后的完整 props。
 * 仅做字段合并，不引入默认值（默认值由 Editor 内部 useEditorProps 处理）。
 */
export function applyUploadAdapters(
  options: TextoryOptions,
): Pick<TextoryOptions, 'imageProps' | 'videoProps' | 'fileProps'> {
  const {upload, imageProps, videoProps, fileProps} = options;

  const next: Pick<TextoryOptions, 'imageProps' | 'videoProps' | 'fileProps'> = {
    imageProps,
    videoProps,
    fileProps,
  };

  if (upload?.image && !imageProps?.onImageUpload) {
    next.imageProps = {
      ...(imageProps ?? {}),
      onImageUpload: wrapSimpleUploader(upload.image),
    };
  }

  if (upload?.file && !fileProps?.onFileUpload) {
    next.fileProps = {
      ...(fileProps ?? {}),
      onFileUpload: wrapSimpleUploader(upload.file),
    };
  }

  if (upload?.video && !videoProps?.onVideoUpload) {
    const videoFn = upload.video;
    next.videoProps = {
      ...(videoProps ?? {}),
      onVideoUpload: wrapVideoUploader(videoFn),
    };
  }

  return next;
}

/**
 * 简单上传函数 → React 版 onImageUpload / onFileUpload 形态。
 *
 * React 版支持两种调用风格：
 * 1. 返回 string | Promise<string>：编辑器自动 resolve
 * 2. 调用 options.onSuccess / onError：legacy callback 风格
 *
 * 简单 upload.* 函数直接 return URL，走第 1 种风格最干净。
 */
function wrapSimpleUploader(
  fn: (file: File) => string | Promise<string>,
): NonNullable<IImageProps['onImageUpload']> {
  return async ({file}) => {
    return await fn(file as File);
  };
}

/**
 * video uploader 返回 `{ url, poster? }` ——
 * React 版 `onVideoUpload` 仅接受 URL 字符串，poster 由独立的 `onPosterUpload` 处理。
 *
 * 若 upload.video 返回对象，拆出 poster 后只剩 url 传给 onVideoUpload；
 * poster 注入到 onPosterUpload（若用户未自定义）。
 */
function wrapVideoUploader(
  fn: NonNullable<UploadAdapters['video']>,
): NonNullable<IVideoProps['onVideoUpload']> {
  return async ({file}) => {
    const result = await fn(file as File);
    if (typeof result === 'string') {
      return result;
    }
    // 对象形态：返回 url 字符串。poster 由 imageNodeView 内部处理；
    // 当前桥接层不主动注入 onPosterUpload（避免与用户配置冲突）。
    // 用户要 poster 请直接配置 videoProps.onPosterUpload。
    return result.url;
  };
}

// 引入 IFileProps / IVideoProps 仅用于类型推导，避免 tsc 报 unused
void (null as unknown as IFileProps);
void (null as unknown as IVideoProps);
