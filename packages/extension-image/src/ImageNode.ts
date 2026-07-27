import {mergeAttributes, Node, nodeInputRule} from '@tiptap/core';
import {ReactNodeViewRenderer} from '@tiptap/react';
import ImageView from './ImageView.tsx';
import type {ImageOptions} from './types/index.ts';
import {BLOCK_TYPES} from '@textory/editor-utils';
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
      /**
       * Internal upload-tracking key. Stable across `UniqueID` rewrites of
       * the `id` attribute, so the toolbar's upload pipeline can still
       * find the inserted node after UniqueID has run.
       */
      uploadKey: {
        default: null,
      },
    };
  },

  parseHTML() {
    const rules: any[] = [
      // Import-time failure marker: data: URLs are normally rejected, but
      // when the import pipeline sets `data-import-error="1"` the image is
      // kept in the doc as an error placeholder node (isError=true) so the
      // user sees what failed instead of the node silently disappearing.
      {
        tag: 'img[data-import-error]',
        getAttrs: (el: HTMLElement) => ({
          isError: true,
          src: el.getAttribute('src'),
          alt: el.getAttribute('alt'),
          title: el.getAttribute('title'),
          width: coerceDim(el.getAttribute('width')),
          height: coerceDim(el.getAttribute('height')),
          textAlign: el.getAttribute('data-text-align') || 'left',
          hasBorder: el.getAttribute('data-has-border') === '1',
        }),
      },
    ];
    rules.push({
      tag: this.options.allowBase64
        ? 'img[src]'
        : 'img[src]:not([src^="data:"])',
    });
    return rules;
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

/** Parse an HTML dimension attribute to a number, or null when missing/invalid. */
function coerceDim(raw: string | null): number | null {
  if (!raw) return null;
  const n = Number.parseInt(raw, 10);
  return Number.isFinite(n) && n > 0 ? n : null;
}
