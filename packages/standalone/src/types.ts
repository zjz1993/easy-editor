/**
 * @textory/standalone 公共类型定义。
 *
 * 这些类型同时用于：
 * 1. UMD/IIFE bundle 的 `window.Textory` 全局入口
 * 2. `npm i -D @textory/standalone` 安装的 d.ts，给 TypeScript 用户写 CDN 引入代码时提供 IDE 提示
 *
 * 设计原则：
 * - 简单 API 优先：90% CDN 用户用 `TextoryOptions` 即可
 * - escape hatch 透传：高级用户用 `imageProps` / `videoProps` / `fileProps` 直接复用 React 版完整类型
 * - 类型源单一：`FeatureFlags` / `IImageProps` 等都从 `@textory/context` re-export，避免重复维护
 */
import type {JSONContent} from '@tiptap/core';
import type {Editor} from '@tiptap/react';
import type {
  FeatureFlags,
  IImageProps,
  IFileProps,
  IVideoProps,
  ExportProps,
  ITitleProps,
} from '@textory/context';
import type {CSSProperties} from 'react';

// 复用 React 版类型，保持文档单一来源
export type {
  FeatureFlags,
  IImageProps,
  IFileProps,
  IVideoProps,
  ExportProps,
  ITitleProps,
} from '@textory/context';

/**
 * 简化版上传函数：传入 File，返回上传后的 URL（或带 poster 的视频对象）。
 *
 * - `image(file)` → 图片 URL
 * - `file(file)` → 文件 URL
 * - `video(file)` → 视频 URL（可选 poster 封面 URL）
 *
 * 与 `imageProps` / `videoProps` / `fileProps` escape hatch 同时存在时，
 * **escape hatch 优先**——简单 `upload.*` 函数会被忽略。
 */
export interface UploadAdapters {
  image?: (file: File) => string | Promise<string>;
  video?: (
    file: File,
  ) => string | Promise<string> | {url: string; poster?: string} | Promise<{url: string; poster?: string}>;
  file?: (file: File) => string | Promise<string>;
}

/**
 * `Textory.create()` 接受的配置项。
 *
 * 字段尽量与 `<Editor>` props 保持一致（便于 React 版与 UMD 版双向迁移），
 * 差异：
 * - `onChange(html: string)`：UMD 版简化签名，仅传 html 字符串
 *   （React 版是 `(content: {json, html}, title) => void`，CDN 用户更关心 html）
 * - 不暴露 `extensions`：UMD 用户需要自定义扩展请走 `@textory/editor` ESM 包
 * - 不暴露 `locale`：目前仅实现中文 locale，开放会让 UI 出现 key 字符串
 */
export interface TextoryOptions {
  /** 初始内容，HTML 字符串或 Tiptap JSON。 */
  content?: string | JSONContent;
  /** 是否可编辑，默认 `true`。 */
  editable?: boolean;
  /** 占位提示文案。 */
  placeholder?: string;
  /** 是否自动聚焦，默认 `false`。 */
  autoFocus?: boolean;
  /** 标题（若 `titleProps.showTitle` 开启）。 */
  title?: string;
  /**
   * 功能开关。默认全开（opt-out）。
   * 仅在编辑器 mount 时生效，运行时修改不会重载扩展。
   * 如需切换 features 请 `destroy()` 后重新 `create()`。
   */
  features?: FeatureFlags;

  // ────────────── 回调（5 个常用事件） ──────────────
  /** 内容变化时触发，参数为当前 HTML 字符串。 */
  onChange?: (html: string) => void;
  /** 编辑器实例就绪后触发（命令队列在此刻 flush）。 */
  onCreate?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
  /** 内部未捕获异常时触发（不阻断编辑器运行）。 */
  onError?: (error: Error) => void;

  // ────────────── 上传配置（双轨） ──────────────
  /**
   * 简化版上传适配器：传 File，返 URL。
   * 适合 80% CDN 场景，免写 `onSuccess` / `onError` / `onProgress` 样板。
   */
  upload?: UploadAdapters;
  /**
   * 完整图片配置（与 React 版 `imageProps` 一致）。
   * 同时设置 `upload.image` 与 `imageProps` 时，**`imageProps` 优先**。
   */
  imageProps?: Partial<IImageProps>;
  videoProps?: Partial<IVideoProps>;
  fileProps?: Partial<IFileProps>;

  // ────────────── 其他 React 版透传 ──────────────
  exportProps?: Partial<ExportProps>;
  titleProps?: Partial<ITitleProps>;
  className?: string;
  style?: CSSProperties;
  transformContent?: (content: JSONContent) => JSONContent;
}

/**
 * `Textory.create()` 返回的编辑器实例句柄。
 *
 * 生命周期：
 * - `create()` 同步返回 instance，但内部 Tiptap editor 实例可能尚未就绪
 *   （React 18 `createRoot().render()` 是异步的）
 * - editor 就绪前调用任何命令方法 → 进入命令队列，`onCreate` 触发后 flush
 * - `destroy()` 后任何方法调用 → `console.warn`，不 throw 不静默
 *
 * Escape hatch：`instance.editor` 暴露原始 Tiptap `Editor` 对象，
 * 用户可调用任何未封装能力（`.chain().focus().toggleBold().run()` 等）。
 * **注意**：`editor` 字段兼容性不保证跨 Tiptap 大版本。
 */
export interface TextoryInstance {
  // ────────────── 基础命令 ──────────────
  getHTML(): string;
  setHTML(html: string): void;
  getJSON(): JSONContent;
  setJSON(json: JSONContent): void;
  focus(): void;
  blur(): void;
  clear(): void;

  // ────────────── 动态更新 ──────────────
  /**
   * 部分更新 options。等价于 React 版改 props 触发 re-render。
   * 内部 setState 实现，所有可变字段都支持。
   */
  setOptions(partial: Partial<TextoryOptions>): void;

  // ────────────── 生命周期 ──────────────
  /**
   * 卸载编辑器，释放 React root + Tiptap 实例。
   * 之后再调用任何方法仅 `console.warn`，不抛错。
   */
  destroy(): void;

  // ────────────── Escape hatch ──────────────
  /**
   * 原始 Tiptap Editor 实例。
   * - mount 完成前为 `null`
   * - `destroy()` 后置为 `null`
   * - 兼容性：跨 Tiptap 大版本不保证，由用户自负其责
   */
  readonly editor: Editor | null;
}

/**
 * UMD 全局 `window.Textory` 的形状。
 */
export interface TextoryAPI {
  /**
   * 在指定 DOM 元素下挂载编辑器。
   *
   * @param element 挂载容器。多次 create 同一 element 行为未定义，请先 `destroy()` 旧的。
   * @param options 配置项
   * @returns 编辑器实例句柄（同步返回，editor 字段可能为 null 直到 mount 完成）
   *
   * @example
   * ```ts
   * const instance = Textory.create(document.getElementById('editor')!, {
   *   content: '<p>hello</p>',
   *   features: { outline: false },
   *   onChange: (html) => console.log(html),
   *   upload: {
   *     image: async (file) => {
   *       const fd = new FormData();
   *       fd.append('file', file);
   *       const res = await fetch('/api/upload', { method: 'POST', body: fd });
   *       return (await res.json()).url;
   *     }
   *   }
   * });
   * ```
   */
  create(element: HTMLElement, options?: TextoryOptions): TextoryInstance;
}
