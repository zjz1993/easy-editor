import { isUndefined } from '@easy-editor/editor-common';
import EditorToolbar from '@easy-editor/editor-toolbar';
import { Bold } from '@easy-editor/extension-bold';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import type { FC } from 'react';
import type { TEasyEditorProps } from './types/index.ts';
import './styles/root.scss';
import { Color } from '@tiptap/extension-color';
import { Placeholder } from '@tiptap/extension-placeholder';
import { TextStyle } from '@tiptap/extension-text-style';
import Underline from '@tiptap/extension-underline';
import useIntlLoaded from './hooks/useIntlLoaded.ts';
//import PasteExtension from './extension/paste/index.tsx';

const Editor: FC<TEasyEditorProps> = props => {
  const {
    editable = true,
    content,
    onChange,
    placeholder = '请输入',
    autoFocus,
  } = props;
  const { intlInit } = useIntlLoaded();
  const extensions = [
    StarterKit.configure({ bold: false }),
    Bold,
    // Blockquote,
    Underline,
    // Strike,
    TextStyle,
    Color,
  ];
  const editor = useEditor({
    autofocus: !isUndefined(autoFocus) ? 'end' : undefined,
    extensions: [
      ...extensions,
      // Paragraph,
      // Text,
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    editable,
    onUpdate: ({ editor }) => {
      onChange?.(editor.state.doc.toJSON());
    },
  });

  return (
    <div className="easy-editor">
      {intlInit && <EditorToolbar editor={editor} />}
      <EditorContent editor={editor} className="easy-editor-body" />
      {/*<BubbleMenu editor={editor}>This is the bubble menu</BubbleMenu>*/}
    </div>
  );
};

export default Editor;
