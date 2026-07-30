import type {TTextoryEditorProps} from '@textory/context';

export const DEFAULT_PROPS: Partial<TTextoryEditorProps> = {
  placeholder: '请输入',
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
    titlePlaceholder: '请输入标题'
  },
  features: {
    outline: true,
    importWord: true,
    fileUpload: true,
    videoUpload: true,
  },
}
