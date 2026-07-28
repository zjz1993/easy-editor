import {Extension} from '@tiptap/core';
import {ImageNode} from './ImageNode.ts';
import type {IImageProps} from '@textory/context';
import {BLOCK_TYPES} from '@textory/editor-utils';

/**
 * Image attachment extension.
 *
 * Historically this extension also registered the upload progress plugin
 * and the paste/drop dispatcher. Those concerns have been extracted into
 * `@textory/extension-upload`'s `UploadExtension`, which must be registered
 * once at the editor root for image (and file) uploads to work.
 */
const AttachmentExtension = Extension.create<Partial<IImageProps>>({
  name: 'attachment',
  addExtensions() {
    return [ImageNode];
  },
  addCommands() {
    return {
      updateAttrs:
        options =>
          ({commands}) => {

            return commands.updateAttributes('image', options);
          },
      setImage:
        options =>
          ({commands}) => {
            const id = options.id;

            return commands.insertContent([
              {
                type: BLOCK_TYPES.IMG,
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
      /**
       * 根据 id 更新图片。
       *
       * 注意：若启用了 `@tiptap/extension-unique-id` 等会改写节点 `id`
       * 的插件，此命令可能在插入后找不到节点。优先使用
       * `updateImageByUploadKey`，它通过 `uploadKey` 属性匹配，不受
       * UniqueID 影响。
       */
      updateImageById:
        (id, attrs) =>
          ({tr, state, dispatch}) => {
            let updated = false;
            state.doc.descendants((node, pos) => {
              if (node.type.name === 'image' && node.attrs.id === id) {
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

            if (updated && dispatch) {
              dispatch(tr);
            }

            return updated;
          },
      /**
       * 根据 uploadKey 更新图片。uploadKey 由上传流程在插入时设置，
       * 独立于 `id`，因此不受 UniqueID 等改写 id 的插件影响。
       */
      updateImageByUploadKey:
        (uploadKey, attrs) =>
          ({tr, state, dispatch}) => {
            if (!uploadKey) return false;
            let updated = false;
            state.doc.descendants((node, pos) => {
              if (
                node.type.name === 'image' &&
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

            if (updated && dispatch) {
              dispatch(tr);
            }

            return updated;
          },
    };
  },
  addOptions() {
    return {
      maxFileSize: 500,
    };
  },
});
export default AttachmentExtension;
