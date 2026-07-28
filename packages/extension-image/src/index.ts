import AttachmentExtension from "./Attachment.ts";
import './types/index.ts';
// export * from './ImageNode';
export { AttachmentExtension };
/**
 * Upload utilities now live in `@textory/extension-upload`.
 * Re-exported here for backwards compatibility — existing imports
 *   `import { updateUploadProgress } from '@textory/extension-image'`
 * keep working without code changes.
 */
export { updateUploadProgress, removeUploadProgress } from '@textory/extension-upload';
export type { ImageOptions } from './types';
