import {Extension} from '@tiptap/core';
import {FileNode} from './FileNode.ts';
import {BLOCK_TYPES} from '@textory/editor-utils';
import type {IFileProps} from '@textory/context';

/**
 * File attachment extension.
 *
 * Hosts the `file` node and the file-specific commands (`setFile`,
 * `updateFileById`, `updateFileByUploadKey`). Upload infrastructure
 * (progress plugin, paste/drop dispatcher) lives in
 * `@textory/extension-upload`'s `UploadExtension` and must be registered
 * separately at the editor root.
 */
const FileExtension = Extension.create<Partial<IFileProps>>({
  name: 'fileAttachment',
  addExtensions() {
    return [FileNode];
  },
  addCommands() {
    return {
      setFile:
        options =>
          ({commands}) => {
            const id = options.id;
            return commands.insertContent([
              {
                type: BLOCK_TYPES.FILE,
                attrs: {
                  ...options,
                  id,
                },
              },
              {
                type: 'paragraph',
              },
            ]);
          },
      updateFileById:
        (id, attrs) =>
          ({tr, state, dispatch}) => {
            if (!id) return false;
            let updated = false;
            state.doc.descendants((node, pos) => {
              if (node.type.name === BLOCK_TYPES.FILE && node.attrs.id === id) {
                tr.setNodeMarkup(pos, undefined, {
                  ...node.attrs,
                  ...attrs,
                });
                updated = true;
              }
            });
            if (updated && dispatch) dispatch(tr);
            return updated;
          },
      updateFileByUploadKey:
        (uploadKey, attrs) =>
          ({tr, state, dispatch}) => {
            if (!uploadKey) return false;
            let updated = false;
            state.doc.descendants((node, pos) => {
              if (
                node.type.name === BLOCK_TYPES.FILE &&
                node.attrs.uploadKey === uploadKey
              ) {
                tr.setNodeMarkup(pos, undefined, {
                  ...node.attrs,
                  ...attrs,
                });
                updated = true;
              }
            });
            if (updated && dispatch) dispatch(tr);
            return updated;
          },
    };
  },
});
export default FileExtension;
