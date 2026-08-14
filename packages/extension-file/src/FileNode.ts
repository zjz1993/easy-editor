import {mergeAttributes, Node} from '@tiptap/core';
import {ReactNodeViewRenderer} from '@tiptap/react';
import FileView from './FileView.tsx';
import {BLOCK_TYPES} from '@textory/editor-utils';
import type {FileNodeAttributes} from '@textory/context';

/**
 * Block-level file attachment node.
 *
 * Serialized as `<a href={src} download={name}>name</a>` so external
 * consumers (docx export, copy to word, etc.) see a normal hyperlink
 * rather than an opaque custom element. The React NodeView takes over
 * rendering inside the editor for a richer card UI.
 */
export const FileNode = Node.create({
  name: BLOCK_TYPES.FILE,
  group: 'block',
  // [drag-handle] 原生 draggable 关闭,统一由 @textory/extension-drag-handle 处理。
  // 详见 .ai/docs/drag-handle.md。如需恢复,取消注释即可。
  // draggable() {
  //   return this.editor.isEditable;
  // },
  selectable() {
    return this.editor.isEditable;
  },
  addAttributes(): Partial<Record<keyof FileNodeAttributes, any>> {
    return {
      src: { default: null },
      name: { default: null },
      size: { default: null },
      ext: { default: null },
      uploadKey: { default: null },
      id: { default: null },
      isError: { default: false },
    };
  },
  parseHTML() {
    return [
      // Prefer anchors explicitly marked as file attachments.
      { tag: 'a[href][data-file-size]' },
      // Fallback: any `download` link. May also match user-authored
      // download links outside the editor — those round-trip into file
      // nodes, which is acceptable behaviour.
      {
        tag: 'a[href][download]',
        getAttrs: (el: HTMLElement) => ({
          src: el.getAttribute('href'),
          name:
            el.getAttribute('download') ||
            el.textContent ||
            undefined,
        }),
      },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    const { src, name, ...rest } = HTMLAttributes;
    return [
      'a',
      mergeAttributes(
        {
          href: src ?? '',
          download: name ?? '',
          // Helps parseHTML prefer this anchor over generic links when
          // both rules could match.
          'data-file-size': rest.size ?? '',
        },
        rest,
      ),
      name ?? '',
    ];
  },
  addNodeView() {
    return ReactNodeViewRenderer(FileView);
  },
});
