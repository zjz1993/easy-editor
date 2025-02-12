import {
  IntlComponent,
  Language_ZhCN,
  isUndefined,
} from '@easy-editor/editor-common';
import EditorToolbar from '@easy-editor/editor-toolbar';
import { Bold } from '@easy-editor/extension-bold';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { type FC, useEffect } from 'react';
import type { TEasyEditorProps } from './types/index.ts';
import './styles/root.scss';
import { Blockquote } from '@tiptap/extension-blockquote';
import { Placeholder } from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
//import MaxLengthExtension from './extension/maxLength/index.ts';
//import PasteExtension from './extension/paste/index.tsx';

const Editor: FC<TEasyEditorProps> = props => {
  const {
    editable = true,
    content,
    onChange,
    placeholder = '请输入',
    autoFocus,
  } = props;
  const extensions = [
    StarterKit.configure({ bold: false }),
    Bold,
    Blockquote,
    Underline,
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
  useEffect(() => {
    const locales = {
      'zh-CN': Language_ZhCN,
      zh_cn: Language_ZhCN,
    };
    IntlComponent.init({
      locales,
      currentLocale: 'zh_cn',
      escapeHtml: false,
    });
  }, []);
  return (
    <div className="easy-editor">
      <EditorToolbar editor={editor} />
      <EditorContent editor={editor} className="easy-editor-body" />
      {/*<BubbleMenu editor={editor}>This is the bubble menu</BubbleMenu>*/}
    </div>
  );
};

export default Editor;
