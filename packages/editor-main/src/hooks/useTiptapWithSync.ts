import {useEffect} from 'react';
import {useEditor} from '@tiptap/react';
import type {EditorEvents} from '@tiptap/core';
import type {EditorProps} from '@tiptap/pm/view';

interface UseTiptapWithSyncOptions {
  content: any;
  editable: boolean;
  placeholder?: string;
  extensions: any[];
  editorProps?: EditorProps;
  autofocus?: 'start' | 'end' | boolean;
  onUpdate?: (props: EditorEvents['update']) => void;
}

export function useTiptapWithSync({
  content,
  editable,
  placeholder,
  extensions,
  autofocus,
  onUpdate,
  editorProps,
}: UseTiptapWithSyncOptions) {
  // 👇 第一次渲染时创建 editor，不在 props 改变时重新创建
  const editor = useEditor({
    content,
    editable,
    extensions: [...extensions],
    autofocus,
    editorProps,
    onUpdate: ({ editor, appendedTransactions, transaction }) => {
      onUpdate?.({ appendedTransactions, transaction, editor });
    },
  });

  // 👇 外部 editable 改变时同步
  useEffect(() => {
    if (editor && editor.isEditable !== editable) {
      editor.setEditable(editable);
    }
  }, [editable, editor]);

  // 👇 content 改变时同步
  useEffect(() => {
    if (!editor) return;

    // 避免重复设置导致光标抖动
    const current = editor.getHTML();
    if (current !== content) {
      editor.commands.setContent(content, {});
    }
  }, [content, editor]);

  // 👇 placeholder 改变时同步
  useEffect(() => {
    if (!editor) return;

    editor.extensionManager.extensions.forEach(ext => {
      if (ext.name === 'placeholder') {
        ext.options.placeholder = placeholder;
      }
    });
    // 触发重绘
    editor.view.dispatch(editor.state.tr);
  }, [placeholder, editor]);

  // 👇 extensions 改变时同步（可选）
  useEffect(() => {
    if (!editor) return;

    // 理论上 Tiptap 不支持 runtime 替换 extensions
    // 但我们可以更新 options，或者让用户自定义行为
    // 这里只做简单触发更新
    editor.setOptions({
      extensions,
    });
  }, [extensions, editor]);

  return editor;
}
