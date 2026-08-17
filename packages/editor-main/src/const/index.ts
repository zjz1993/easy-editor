import type {TTextoryEditorProps} from '@textory/context';
import {IntlComponent} from '@textory/editor-common';

// 注意：DEFAULT_PROPS 在模块加载时取值，此时 IntlComponent 可能尚未 init
// （init 在 root.tsx 的 useEffect 中异步执行）。为避免空字符串默认值，
// 这里采用 `IntlComponent.get(...) || '中文兜底'` 的写法；intl 完成 init
// 后，root.tsx 因 intlInit 状态变化 re-render，会重新读到 intl 的值。
export const DEFAULT_PROPS: Partial<TTextoryEditorProps> = {
  placeholder: IntlComponent.get('editor.placeholder.default') || '请输入',
  editable: true,
  imageProps: {
    minWidth: 100,
    minHeight: 100,
    // Explicit KB limit (was previously sourced from
    // `AttachmentExtension.options.maxFileSize` via a fallback in the
    // Upload component; that fallback was removed when upload
    // infrastructure moved to @textory/extension-upload).
    maxFileSize: 500,
  },
  fileProps: {
    accept: '*',
    // 50 MB in KB. Files are typically much larger than images.
    maxFileSize: 51200,
  },
  videoProps: {
    // Restrict to widely-supported video formats. Other formats
    // accepted by `isVideoExt` (avi/wmv/flv …) are technically
    // detected but `<video>` playback is unreliable across browsers.
    accept: '.mp4,.webm,.mov,.m4v',
    // 100 MB in KB. Videos are larger than files (50MB) because video
    // is a richer media; raising the ceiling avoids rejecting typical
    // 1-3 minute clips.
    maxFileSize: 102400,
  },
  titleProps: {
    showTitle: true,
    titlePlaceholder: IntlComponent.get('editor.placeholder.title') || '请输入标题'
  },
  features: {
    outline: true,
    importWord: true,
    fileUpload: true,
    videoUpload: true,
    characterCount: true,
  },
}
