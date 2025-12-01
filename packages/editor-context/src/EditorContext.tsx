import type React from 'react';
import {createContext, useContext} from 'react';
import type {Editor} from '@tiptap/react';
import type {TEasyEditorProps} from './types/index.ts';

export interface EditorContextValue {
  editor: Editor | null;
  props: TEasyEditorProps;
}

const Ctx = createContext<EditorContextValue | null>(null);

export const EditorProvider = ({
  editor,
  props,
  children,
}: {
  editor: Editor | null;
  props: TEasyEditorProps;
  children: React.ReactNode;
}) => {
  return <Ctx.Provider value={{ editor, props }}>{children}</Ctx.Provider>;
};

export const useEditorContext = () => {
  const ctx = useContext(Ctx);
  if (!ctx) {
    throw new Error('useEditorContext must be used inside <EditorProvider>.');
  }
  return ctx;
};
