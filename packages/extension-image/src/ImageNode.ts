import {mergeAttributes, Node, nodeInputRule} from '@tiptap/core';
import {ReactNodeViewRenderer} from '@tiptap/react';
import ImageView from './ImageView.tsx';

export interface ImageNodeAttributes {
  src: string;
  alt?: string;
  title?: string;
  width?: number;
  height?: number;
  textAlign?: 'center' | 'left' | 'right';
  id?: string;
  hasBorder?: boolean;
  loading?: boolean;
  loadingProgress?: number;
  tempFile?: any;
}

export interface ImageOptions {
  inline: boolean;

  allowBase64: boolean;

  HTMLAttributes: Record<string, any>;
  minWidth: number;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    image: {
      setImage: (obj: ImageNodeAttributes) => ReturnType;
      updateAttrs: (obj: ImageNodeAttributes) => ReturnType;
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

  addOptions() {
    return {
      inline: false,
      allowBase64: false,
      HTMLAttributes: {},
      minWidth: 50,
    };
  },

  inline() {
    return this.options.inline;
  },

  group() {
    return this.options.inline ? 'inline' : 'block';
  },

  draggable() {
    return this.editor.isEditable;
  },
  selectable() {
    return this.editor.isEditable;
  },

  addAttributes(): Partial<Record<keyof ImageNodeAttributes, any>> {
    return {
      tempFile: {
        default: null,
      },
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
          console.log('updateAttrs调用了');
          return commands.updateAttributes('image', options);
        },
      setImage:
        options =>
        ({ commands }) => {
          return commands.insertContent([
            { type: this.name, attrs: options },
            // 插入图片后加个空行
            {
              type: 'paragraph',
              content: [],
            },
          ]);
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
