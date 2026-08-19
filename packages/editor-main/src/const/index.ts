import type {TTextoryEditorProps} from '@textory/context';
import {initIntl, IntlComponent} from '@textory/editor-common';

// DEFAULT_PROPS 是模块级常量，import 时即求值，因此 IntlComponent.get()
// 必须在 intl 初始化之后执行。initIntl() 幂等且同步（locales 为构建期内联
// 对象），保证此处读到真实文案，而不是 init 前的空字符串。
initIntl();

export const DEFAULT_PROPS: Partial<TTextoryEditorProps> = {
  placeholder: IntlComponent.get('editor.placeholder.default'),
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
    titlePlaceholder: IntlComponent.get('editor.placeholder.title'),
  },
  features: {
    outline: true,
    importWord: true,
    fileUpload: true,
    videoUpload: true,
    characterCount: true,
    markdown: true,
  },
}
