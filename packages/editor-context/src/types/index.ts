import type {JSONContent} from '@tiptap/core';
import type {Editor as TiptapEditor} from '@tiptap/react';
import type {IFileProps, IImageProps, IVideoProps} from './imageProps.ts';
import type {CSSProperties} from "react";
import type {ExportProps} from "./exportProps.ts";
import type {FeatureFlags} from '../features';
import type {ITitleProps} from "./titleProps.ts";

// re-export 供外部直接 import 类型用
export type {IFileProps, IImageProps, IVideoProps} from './imageProps.ts';
export type {ExportProps} from "./exportProps.ts";
export type {FeatureFlags} from '../features';
export type {ITitleProps} from "./titleProps.ts";

export type AlignType = 'left' | 'center' | 'right';

export type TTextoryEditorProps = {
  title?: string;
  content?: string | JSONContent;
  maxCount?: number;
  onChange?: (content: {json: JSONContent, html: string}, title: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  editable?: boolean;
  imageProps?: Partial<IImageProps>;
  fileProps?: Partial<IFileProps>;
  videoProps?: Partial<IVideoProps>;
  exportProps?: Partial<ExportProps>;
  titleProps?: Partial<ITitleProps>;
  className?: string;
  style?: CSSProperties;
  /**
   * JSON content 预处理钩子。
   *
   * 在 content 传入 Tiptap 前对 JSONContent 做清洗/转换。仅对 JSON 形式的 content
   * 生效（HTML 字符串不经过此函数）。初始 content 与后续 setContent 都会调用一次。
   *
   * 典型用途：
   * - 旧编辑器数据迁移到新编辑器，过滤 schema 不再支持的节点类型
   * - 字段重命名（如 attrs.link → attrs.href）
   * - 业务侧自定义清洗（XSS 过滤、白名单字段、节点降级等）
   *
   * 推荐配合 Tiptap 内置 `rewriteUnknownContent(json, schema)` 使用——schema 需在
   * editor 就绪后从 `editor.schema` 获取，所以建议在 setContent 阶段做：
   *
   * ```tsx
   * import { rewriteUnknownContent } from '@tiptap/core';
   * import { useRef } from 'react';
   *
   * const ref = useRef<EditorRef>(null);
   * <Editor
   *   ref={ref}
   *   content={oldJson}
   *   transformContent={(json) => {
   *     const schema = ref.current?.editor?.schema;
   *     if (!schema) return json;
   *     return rewriteUnknownContent(json, schema).json ?? json;
   *   }}
   * />
   * ```
   *
   * 函数抛错会被 try-catch 兜住，回退到原始 content，不会让编辑器白屏。
   *
   * 注意：初始 content 的首次调用发生在 editor 创建前，此时 schema 尚不可用；
   * 若初始 JSON 含未知 node 类型导致 useEditor 内部 `Node.fromJSON` 抛错，
   * 仍会触发白屏——使用方应在传入前自行用其它方式（如纯 JSON 递归过滤）兜底。
   */
  transformContent?: (content: JSONContent) => JSONContent;
  /**
   * 可选功能的启用/停用开关。
   *
   * 默认全部启用（opt-out）。仅在编辑器 mount 时生效，
   * 运行时修改不会重新加载扩展——如需切换，请给 `<Editor>` 加 `key` 强制 remount。
   *
   * @example
   * <Editor features={{ outline: false }} />
   */
  features?: FeatureFlags;
  /**
   * 内部 Tiptap Editor 实例就绪后触发。
   *
   * 供 UMD 桥接层（`@textory/standalone`）等非 React 集成场景拿到原始 editor 引用。
   * 一般 React 项目无需使用，需要 editor 时优先用 `useEditorInstance()`。
   *
   * 在 editor 首次非空时触发一次；不会在 unmount 时再触发（unmount 由父组件自己处理）。
   */
  onEditorReady?: (editor: TiptapEditor) => void;
};
