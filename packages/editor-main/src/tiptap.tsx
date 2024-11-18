import type { TEasyEditorProps } from '@/types/index.ts';
import EditorToolbar from '@easy-editor/editor-toolbar';
import { BubbleMenu, EditorProvider, FloatingMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import type { FC } from 'react';
import React from 'react';

// define your extension array
const extensions = [StarterKit];

const content = '<p>Hello World!</p>';

const Tiptap: FC<TEasyEditorProps> = () => {
  return (
    <EditorProvider extensions={extensions} content={content}>
      <EditorToolbar />
      <FloatingMenu editor={null}>This is the floating menu</FloatingMenu>
      <BubbleMenu editor={null}>This is the bubble menu</BubbleMenu>
    </EditorProvider>
  );
};

export default Tiptap;
