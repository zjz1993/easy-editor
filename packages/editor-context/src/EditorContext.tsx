import type React from 'react';
import {createContext, useContext, useMemo} from 'react';
import type {Editor} from '@tiptap/react';
import type {TTextoryEditorProps} from './types/index.ts';

export interface EditorContextValue {
  editor: Editor | null;
  props: TTextoryEditorProps;
}

const Ctx = createContext<EditorContextValue | null>(null);

export const EditorProvider = ({
  editor,
  props,
  children,
}: {
  editor: Editor | null;
  props: TTextoryEditorProps;
  children: React.ReactNode;
}) => {
  // memo context value，避免 provider 父级 re-render 时（如本仓库 root.tsx
  // 的 isTitleFocused 切换）让所有 useEditorContext 消费者跟着重渲染。
  // 仅当 editor 实例或 props 引用真正变化时才通知消费者。
  // 详见 .ai/performance-issues.md P1-1。
  const value = useMemo<EditorContextValue>(() => ({ editor, props }), [editor, props]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};

export const useEditorContext = () => {
  const ctx = useContext(Ctx);
  if (!ctx) {
    throw new Error('useEditorContext must be used inside <EditorProvider>.');
  }
  return ctx;
};
