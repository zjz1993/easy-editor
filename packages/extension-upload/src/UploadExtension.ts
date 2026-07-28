import {Extension} from '@tiptap/core';
import {createUploadPlugin} from './plugin/ProgressPlugin.ts';
import uploadPasteAndDropPlugin from './plugin/pasteDrop.ts';

/**
 * Shared upload infrastructure extension.
 *
 * Registers the cross-cutting ProseMirror plugins used by both
 * `@textory/extension-image` and `@textory/extension-file`:
 *
 * 1. Progress-plugin: tracks per-uploadKey progress so NodeViews can render
 *    a progress ring while the user's upload handler runs.
 * 2. Paste/Drop-plugin: classifies pasted/dropped files by MIME type and
 *    dispatches them to the matching uploader ref (`imgUploader` /
 *    `fileUploader`) set on `editorProps`.
 *
 * Register ONCE per editor — multiple instances cause a plugin-key conflict
 * inside ProseMirror. Image and file extensions DEPEND on this being
 * present; they do not register their own progress plugins.
 */
export const UploadExtension = Extension.create({
  name: 'upload',
  addProseMirrorPlugins() {
    const plugins = [createUploadPlugin()];
    if (this.editor.isEditable) {
      plugins.push(uploadPasteAndDropPlugin());
    }
    return plugins;
  },
});
