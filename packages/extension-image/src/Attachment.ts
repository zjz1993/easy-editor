import {Extension} from '@tiptap/core';
import {ImageNode} from './ImageNode.ts';
import type {IImageProps} from '@textory/context';
import {BLOCK_TYPES} from '@textory/editor-common';
import {createUploadPlugin} from './plugin/ImagePlaceholderPlugin.ts';
import uploadPasteAndDropPlugin from './plugin/pasteDrop.ts';

const AttachmentExtension = Extension.create<Partial<IImageProps>>({
  name: 'attachment',
  addExtensions() {
    return [ImageNode];
  },
  addProseMirrorPlugins() {
    const array = [createUploadPlugin()];
    if (this.editor.isEditable) {
      array.push(uploadPasteAndDropPlugin());
    }
    return array;
  },
  addCommands() {
    return {
      updateAttrs:
        options =>
        ({ commands }) => {
          console.log('updateAttrs调用了', options);
          return commands.updateAttributes('image', options);
        },
      setImage:
        options =>
        ({ commands }) => {
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
       * 根据 id 更新图片
       */
      updateImageById:
        (id, attrs) =>
        ({ tr, state, dispatch }) => {
          let updated = false;
          state.doc.descendants((node, pos) => {
            if (node.type.name === 'image' && node.attrs.id === id) {
              const previewSrc = node.attrs.src;
              if (previewSrc.startsWith('blob:')) {
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
