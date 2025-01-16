import EditorToolbar from '@easy-editor/editor-toolbar';
import { Bold } from '@easy-editor/extension-bold';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import type { FC } from 'react';
import type { TEasyEditorProps } from './types/index.ts';
import './styles/root.scss';
//import MaxLengthExtension from './extension/maxLength/index.ts';
//import PasteExtension from './extension/paste/index.tsx';

const Editor: FC<TEasyEditorProps> = props => {
  const { content, onChange } = props;
  const extensions = [
    StarterKit.configure({
      bold: false, // 禁用 StarterKit 的默认 Bold 扩展
    }),
    Bold,
  ];
  const editor = useEditor({
    extensions: [
      ...extensions,
      //PasteExtension,
      //MaxLengthExtension.configure({ maxLength: maxCount }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange?.(editor.state.doc.toJSON());
    },
  });
  return (
    <div className="easy-editor">
      <EditorToolbar editor={editor} />
      <EditorContent editor={editor} className="easy-editor-body" />
      {/*<BubbleMenu editor={editor}>This is the bubble menu</BubbleMenu>*/}
    </div>
  );
};

export default Editor;
