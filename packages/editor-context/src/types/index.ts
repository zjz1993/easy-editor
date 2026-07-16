import type {JSONContent} from '@tiptap/core';
import type {IImageProps} from './imageProps.ts';
import type {CSSProperties} from "react";
import type {ExportProps} from "./exportProps.ts";
import type {FeatureFlags} from '../features';

export type AlignType = 'left' | 'center' | 'right';

export type TEasyEditorProps = {
  outputHTML?: boolean;
  title?: string;
  content?: string | JSONContent;
  maxCount?: number;
  onChange?: (data: string | JSONContent) => void;
  placeholder?: string;
  autoFocus?: boolean;
  editable?: boolean;
  imageProps?: Partial<IImageProps>;
  exportProps?: Partial<ExportProps>;
  className?: string;
  style?: CSSProperties;
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
};
