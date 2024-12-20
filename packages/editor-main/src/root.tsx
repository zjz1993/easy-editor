import type { TEasyEditorProps } from '@/types/index.ts';
import EditorToolbar from '@easy-editor/editor-toolbar';
import { BubbleMenu, EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import type { FC } from 'react';
import '@/styles/root.scss';

const Editor: FC<TEasyEditorProps> = props => {
  const { content } = props;
  const extensions = [StarterKit];
  const editor = useEditor({
    extensions,
    content,
  });
  return (
    <div>
      <EditorToolbar />
      <EditorContent editor={editor} />
      <BubbleMenu editor={editor}>This is the bubble menu</BubbleMenu>
    </div>
  );
};

export default Editor;
