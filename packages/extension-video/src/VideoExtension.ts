import {Extension} from '@tiptap/core';
import {VideoNode} from './VideoNode.ts';
import {BLOCK_TYPES} from '@textory/editor-utils';
import type {IVideoProps} from '@textory/context';

/**
 * Video attachment extension.
 *
 * Hosts the `video` node and the video-specific commands (`setVideo`,
 * `updateVideoById`, `updateVideoByUploadKey`). Upload infrastructure
 * (progress plugin, paste/drop dispatcher) lives in
 * `@textory/extension-upload`'s `UploadExtension` and must be registered
 * separately at the editor root.
 *
 * Mirrors `FileExtension` shape — single Node + Extension wrapper with
 * insert/update commands.
 */
const VideoExtension = Extension.create<Partial<IVideoProps>>({
  name: 'videoAttachment',
  addExtensions() {
    return [VideoNode];
  },
  addCommands() {
    return {
      setVideo:
        options =>
          ({commands}) => {
            const id = options.id;
            return commands.insertContent([
              {
                type: BLOCK_TYPES.VIDEO,
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
      updateVideoById:
        (id, attrs) =>
          ({tr, state, dispatch}) => {
            if (!id) return false;
            let updated = false;
            state.doc.descendants((node, pos) => {
              if (
                node.type.name === BLOCK_TYPES.VIDEO &&
                node.attrs.id === id
              ) {
                const previewSrc = node.attrs.src;
                if (previewSrc?.startsWith('blob:')) {
                  URL.revokeObjectURL(previewSrc);
                }
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
      updateVideoByUploadKey:
        (uploadKey, attrs) =>
          ({tr, state, dispatch}) => {
            if (!uploadKey) return false;
            let updated = false;
            state.doc.descendants((node, pos) => {
              if (
                node.type.name === BLOCK_TYPES.VIDEO &&
                node.attrs.uploadKey === uploadKey
              ) {
                const previewSrc = node.attrs.src;
                if (previewSrc?.startsWith('blob:')) {
                  URL.revokeObjectURL(previewSrc);
                }
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
export default VideoExtension;
