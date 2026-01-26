import {BLOCK_TYPES, isUndefined, MessageContainer, wrapBlockExtensions,} from '@textory/editor-common';
import {EditorToolbar} from '@textory/editor-toolbar';
import {Bold} from '@textory/extension-bold';
import {EditorContent} from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import cx from 'classnames';
import type {FC} from 'react';
import {CodeBlock} from '@textory/extension-code-block';
import {Indent} from '@textory/extension-indent';
import {CustomLink} from '@textory/extension-link';
import {TaskItem, TaskList} from '@textory/extension-task-item';
import {Color} from '@tiptap/extension-color';
import {ImageNode} from '@textory/extension-image';
import {Table, TableBubbleMenu, TableCell, TableHeader, TableRow,} from '@textory/extension-table';
import {Placeholder} from './extension/Placeholder';
import {TextAlign} from '@tiptap/extension-text-align';
import {TextStyle} from '@tiptap/extension-text-style';
import BulletList from './BulletList/bullet-list.ts';
import {ListItem} from './BulletList/list-item.ts';
import {UniqueIDExtension} from './extension/UniqueIDExtension/index.ts';
import useIntlLoaded from './hooks/useIntlLoaded.ts';
import EditorFilePreview from './components/FilePreview/EditorFilePreview';
import Underline from '@tiptap/extension-underline';
import {OutlineExtension, OutlineView} from '@textory/extension-outline';
import {useEditorProps} from './hooks/useEditorProps.ts';
import {EditorProvider, type TEasyEditorProps} from '@textory/context';
import {useTiptapWithSync} from './hooks/useTiptapWithSync.ts';

const Editor: FC<TEasyEditorProps> = props => {
  const { intlInit } = useIntlLoaded();
  const { CL, OL, UL, P, H, CLI, LI, QUOTE, HR, TL, IMG, TABLE } = BLOCK_TYPES;
  const listGroup = `${UL}|${OL}|${CL}`;
  const mergedProps: TEasyEditorProps = useEditorProps(props, {
    placeholder: '请输入',
    editable: true,
    imageProps: {
      max: 0,
      minWidth: 100,
      minHeight: 100,
    },
  });
  const { content, onChange, autoFocus, placeholder, className, style } =
    mergedProps;
  const extensions = [
    StarterKit.configure({
      bold: false,
      codeBlock: false,
      underline: false,
      link: false,
    }),
    Bold,
    Table.configure({
      resizable: true,
    }),
    TableRow,
    TableHeader,
    TableCell,
    TextStyle,
    Color,
    Underline,
    CustomLink,
    CodeBlock,
    Indent.configure({
      types: [P, H, CL, CLI, OL, UL, LI, QUOTE, HR],
      itemTypeName: BLOCK_TYPES.CLI,
      minLevel: 0,
      maxLevel: 10,
    }),
    TextAlign.configure({
      types: [BLOCK_TYPES.H, BLOCK_TYPES.P, BLOCK_TYPES.IMG],
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
    UniqueIDExtension,
    ImageNode,
    // CustomParagraph,
  ];
  const editor = useTiptapWithSync({
    autofocus: !isUndefined(autoFocus) ? 'end' : undefined,
    extensions: [
      ...wrapBlockExtensions(
        extensions,
        [P, H, CL, OL, UL, QUOTE, HR, TL, IMG],
        '',
      ),
      OutlineExtension,
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    editable: mergedProps.editable,
    onUpdate: ({ editor }) => {
      onChange?.(editor.state.doc.toJSON());
    },
  });

  if (import.meta.env.MODE === 'development') {
    (window as any).__EASY_EDITOR__ = editor;
  }
  return (
    <EditorProvider editor={editor} props={mergedProps}>
      <div className={cx('textory', className)} style={style}>
        {intlInit && (
          <EditorToolbar editor={editor} imageProps={mergedProps.imageProps} />
        )}
        <EditorContent
          autoFocus={autoFocus}
          editor={editor}
          className="textory-body"
        >
          <OutlineView editor={editor} />
        </EditorContent>
        <MessageContainer />
        <TableBubbleMenu editor={editor} />
        <EditorFilePreview editor={editor} />
        {/*<BubbleMenu editor={editor}>This is the bubble menu</BubbleMenu>*/}
      </div>
    </EditorProvider>
  );
};

export default Editor;
