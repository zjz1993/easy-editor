import {mergeAttributes, Node} from '@tiptap/core';
import {ReactNodeViewRenderer} from '@tiptap/react';
import VideoView from './VideoView.tsx';
import {BLOCK_TYPES} from '@textory/editor-utils';
import type {VideoNodeAttributes} from '@textory/context';
import type {VideoOptions} from './types/index.ts';

/**
 * Block-level video node.
 *
 * Always serialized as `<video controls src poster>` — both uploaded
 * files and network URLs render through the same path. The browser
 * handles whichever codec/protocol the src points at.
 *
 * Group is `block` — the node occupies its own line and can be nested
 * inside any block container via `wrapBlockExtensions`.
 *
 * Upload infrastructure (progress plugin, paste/drop dispatcher) lives
 * in `@textory/extension-upload`'s `UploadExtension` and must be registered
 * separately at the editor root.
 */
export const VideoNode = Node.create<VideoOptions>({
  name: BLOCK_TYPES.VIDEO,
  group: 'block',
  draggable() {
    return this.editor.isEditable;
  },
  selectable() {
    return this.editor.isEditable;
  },

  addOptions() {
    return {
      inline: false,
      HTMLAttributes: {},
      minWidth: 200,
    };
  },

  addAttributes(): Partial<Record<keyof VideoNodeAttributes, any>> {
    return {
      src: {default: null},
      poster: {default: null},
      width: {default: null},
      height: {default: null},
      name: {default: null},
      size: {default: null},
      textAlign: {default: 'left'},
      /**
       * Internal upload-tracking key. Stable across `UniqueID` rewrites of
       * the `id` attribute, so the upload pipeline can still find the node
       * after UniqueID has run. @see ImageNodeAttributes.uploadKey
       */
      uploadKey: {default: null},
      id: {default: null},
      isError: {default: false},
    };
  },

  parseHTML() {
    return [
      {
        tag: 'video[src]',
        getAttrs: (el: HTMLElement) => ({
          src: el.getAttribute('src') ?? undefined,
          poster: el.getAttribute('poster') ?? undefined,
          width: coerceDim(el.getAttribute('width')),
          height: coerceDim(el.getAttribute('height')),
          textAlign:
            (el.getAttribute('data-text-align') as VideoNodeAttributes['textAlign']) ||
            'left',
        }),
      },
    ];
  },

  renderHTML({HTMLAttributes}) {
    const {src, poster, ...rest} = HTMLAttributes as VideoNodeAttributes;
    return [
      'video',
      mergeAttributes(this.options.HTMLAttributes, rest, {
        src: src ?? '',
        controls: 'true',
        poster: poster || undefined,
        'data-video': '1',
      }),
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(VideoView);
  },
});

/** Parse an HTML dimension attribute to a number, or null when missing/invalid. */
function coerceDim(raw: string | null): number | null {
  if (!raw) return null;
  const n = Number.parseInt(raw, 10);
  return Number.isFinite(n) && n > 0 ? n : null;
}
