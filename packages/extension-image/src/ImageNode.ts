import {mergeAttributes, Node, nodeInputRule} from '@tiptap/core';
import {ReactNodeViewRenderer} from '@tiptap/react';
import ImageView from './ImageView.tsx';
import type {ImageOptions} from './types/index.ts';
import {BLOCK_TYPES} from '@textory/editor-common';
import type {ImageNodeAttributes} from '@textory/context';

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
  name: BLOCK_TYPES.IMG,
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
      isError: {
        default: false,
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
