import type { Editor } from '@tiptap/core';
import type { EditorState, Transaction } from '@tiptap/pm/state';
import type { EditorView } from '@tiptap/pm/view';
import type { CSSProperties } from 'react';

export interface TToolbarWrapperProps {
  disabled?: boolean;
  className?: string;
  style?: CSSProperties;
  intlStr?: string;
}

export interface IToolbarCommonProps {
  dispatch: (tr: Transaction) => void;
  value: EditorState;
  view: EditorView;
  editor: Editor;
  disabled?: boolean;
}
