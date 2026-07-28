export { UploadExtension } from './UploadExtension.ts';
export { updateUploadProgress, removeUploadProgress } from './utils/progress.ts';
export {
  uploadPluginKey,
  /** @deprecated alias kept for backwards compatibility. */
  uploadPluginKey as attachmentUploadPluginKey,
  type UploadState,
} from './plugin/ProgressPlugin.ts';
