import type {Editor} from '@tiptap/core';
import type {EditorState, Transaction} from '@tiptap/pm/state';
import type {EditorView} from '@tiptap/pm/view';
import type {CSSProperties} from 'react';

/**
 * Tiptap `editor.storage` 模块增强。
 *
 * `@textory/editor`（editor-main）注册了 `DocMetaExtension`，把文档标题
 * 暴露在 `editor.storage.docMeta.title`。此处的 module augmentation 让
 * editor-toolbar 内的代码能拿到类型提示，无需依赖 editor-main（避免循环依赖）。
 *
 * 如果 editor-main 那边新增 / 修改 storage 形状，请同步更新本声明。
 */
declare module '@tiptap/core' {
  interface Storage {
    docMeta?: {
      title: string;
    };
  }
}

export interface TToolbarWrapperProps {
  disabled?: boolean;
  className?: string;
  style?: CSSProperties;
  intlStr?: string;
  editor: Editor;
}

export interface IToolbarCommonProps {
  dispatch: (tr: Transaction) => void;
  value: EditorState;
  view: EditorView;
  editor: Editor;
  disabled?: boolean;
}
