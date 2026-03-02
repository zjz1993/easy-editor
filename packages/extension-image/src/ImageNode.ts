import {mergeAttributes, Node, nodeInputRule} from '@tiptap/core';
import {ReactNodeViewRenderer} from '@tiptap/react';
import ImageView from './ImageView.tsx';
import type {ImageNodeAttributes, ImageOptions} from './types/index.ts';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    image: {
      setImage: (obj: ImageNodeAttributes) => ReturnType;
      updateAttrs: (obj: ImageNodeAttributes) => ReturnType;
      updateImageById: (id: string, attrs: ImageNodeAttributes) => ReturnType;
    };
  }
}

/**
 * Matches an image to a ![image](src "title") on input.
 */
export const inputRegex =
  /(?:^|\s)(!\[(.+|:?)]\((\S+)(?:(?:\s+)["'](\S+)["'])?\))$/;

/**
 * This extension allows you to insert images.
 * @see https://www.tiptap.dev/api/nodes/image
 */
export const ImageNode = Node.create<ImageOptions>({
  name: 'image',
  group: 'inline',
  inline: true,
  draggable() {
    return this.editor.isEditable;
  },

  addOptions() {
    return {
      inline: false,
      allowBase64: false,
      HTMLAttributes: {},
      minWidth: 50,
    };
  },

  selectable() {
    return this.editor.isEditable;
  },

  addAttributes(): Partial<Record<keyof ImageNodeAttributes, any>> {
    return {
      loadingProgress: {
        default: 0,
      },
      loading: {
        default: true,
      },
      textAlign: {
        default: 'left',
      },
      hasBorder: { default: false },
      width: {
        default: null,
      },
      height: {
        default: null,
      },
      src: {
        default: null,
      },
      alt: {
        default: null,
      },
      title: {
        default: null,
      },
      id: {
        default: null,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: this.options.allowBase64
          ? 'img[src]'
          : 'img[src]:not([src^="data:"])',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'img',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
    ];
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
              type: this.name,
              attrs: {
                ...options,
                id,
                loading: true,
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

  addInputRules() {
    return [
      nodeInputRule({
        find: inputRegex,
        type: this.type,
        getAttributes: match => {
          const [, , alt, src, title] = match;

          return { src, alt, title };
        },
      }),
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageView);
  },
});
