import { BLOCK_TYPES, isUndefined } from '@easy-editor/editor-common';
import EditorToolbar from '@easy-editor/editor-toolbar';
import { Bold } from '@easy-editor/extension-bold';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import type { FC } from 'react';
import type { TEasyEditorProps } from './types/index.ts';
import './styles/root.scss';
import { CodeBlock } from '@easy-editor/extension-code-block';
import { Indent } from '@easy-editor/extension-indent';
import { CustomLink } from '@easy-editor/extension-link';
import { TaskItem, TaskList } from '@easy-editor/extension-task-item';
import { Color } from '@tiptap/extension-color';
import { Placeholder } from '@tiptap/extension-placeholder';
import { TextAlign } from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import Underline from '@tiptap/extension-underline';
import BulletList from './BulletList/bullet-list.ts';
import { ListItem } from './BulletList/list-item.ts';
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
  const { CL, OL, UL, P, H, CLI, LI, QUOTE, HR } = BLOCK_TYPES;
  const listGroup = `${UL}|${OL}|${CL}`;
  const extensions = [
    StarterKit.configure({ bold: false, codeBlock: false }),
    Bold,
    Underline,
    TextStyle,
    Color,
    CustomLink,
    CodeBlock,
    Indent.configure({
      types: [P, H, CL, CLI, OL, UL, LI, QUOTE, HR],
      itemTypeName: BLOCK_TYPES.CLI,
      minLevel: 0,
      maxLevel: 10,
    }),
    TextAlign.configure({
      types: ['heading', 'paragraph'],
    }),
    ListItem.extend({ name: BLOCK_TYPES.LI }),
    BulletList.extend({ name: BLOCK_TYPES.UL }).configure({
      keepMarks: true,
      keepAttributes: true,
      content: `(listItem|${listGroup}|checklistItem)+`,
      itemTypeName: BLOCK_TYPES.LI,
    }),
    TaskList,
    TaskItem,
  ];
  const editor = useEditor({
    autofocus: !isUndefined(autoFocus) ? 'end' : undefined,
    extensions: [
      ...extensions,
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
