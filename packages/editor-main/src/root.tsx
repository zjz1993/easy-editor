import {BLOCK_TYPES, wrapBlockExtensions} from '@textory/editor-utils';
import {MessageContainer} from '@textory/editor-common';
import {isUndefined} from 'lodash-es';
import {EditorToolbar} from '@textory/editor-toolbar';
import {Bold} from '@textory/extension-bold';
import {EditorContent} from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import cx from 'classnames';
import {forwardRef, useCallback, useEffect, useImperativeHandle, useRef} from 'react';
import {CodeBlock} from '@textory/extension-code-block';
import {Indent} from '@textory/extension-indent';
import {CustomLink} from '@textory/extension-link';
import {TaskItem, TaskList} from '@textory/extension-task-item';
import {Color} from '@tiptap/extension-color';
import {Highlight} from '@textory/extension-highlight';
import {AttachmentExtension} from '@textory/extension-image';
import {Table, TableBubbleMenu, TableCell, TableHeader, TableRow,} from '@textory/extension-table';
import {Placeholder} from './extension/Placeholder';
import {TextAlign} from '@tiptap/extension-text-align';
import {TextStyle} from '@tiptap/extension-text-style';
import BulletList from './BulletList/bullet-list.ts';
import {ListItem} from './BulletList/list-item.ts'; // import {UniqueIDExtension} from './extension/UniqueIDExtension/index.ts';
import useIntlLoaded from './hooks/useIntlLoaded.ts';
import EditorFilePreview from './components/FilePreview/EditorFilePreview';
import Underline from '@tiptap/extension-underline';
import {OutlineExtension, OutlineView} from '@textory/extension-outline';
import {useEditorProps} from './hooks/useEditorProps.ts';
import {EditorProvider, type TEasyEditorProps} from '@textory/context';
import {useTiptapWithSync} from './hooks/useTiptapWithSync.ts';
import {exportWORD, type ExportOptions} from '@textory/extension-export';

/**
 * Ref handle exposed by the Editor component.
 * Allows parent components to call imperative methods.
 */
export interface EditorRef {
  /**
   * Export the editor content as a DOCX file.
   * Uses the editor's current content if `data.content` is not provided.
   */
  export: (options?: ExportOptions) => Promise<void>;
  /**
   * Import a .docx file, replacing the entire document.
   *
   * Dynamically loads `@textory/extension-import-word` (and mammoth) on first
   * call, so the main bundle stays small when the feature is unused.
   *
   * Requires `features.importWord` to be enabled. Images are uploaded via
   * the configured `imageProps.onImageUpload` handler.
   */
  import: (file: File) => Promise<void>;
}

const Editor = forwardRef<EditorRef, TEasyEditorProps>((props, ref) => {
  const imgUploader = useRef<any>();
  const fileUploader = useRef<any>();
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
    features: {
      outline: true,
      importWord: true,
    },
  });
  const {
    content,
    onChange,
    autoFocus,
    placeholder,
    className,
    style,
    outputHTML,
  } = mergedProps;
  const isOutlineEnabled = mergedProps.features?.outline ?? true;
  const isImportWordEnabled = mergedProps.features?.importWord ?? false;
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
    Highlight,
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
    AttachmentExtension.configure(props.imageProps),
    // CustomParagraph,
  ];
  const editor = useTiptapWithSync({
    editorProps: {
      imgUploader,
      fileUploader,
    },
    autofocus: !isUndefined(autoFocus) ? 'end' : undefined,
    extensions: [
      ...wrapBlockExtensions(
        extensions,
        [P, H, CL, OL, UL, QUOTE, HR, TL, IMG],
        '',
      ),
      ...(isOutlineEnabled ? [OutlineExtension] : []),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    editable: mergedProps.editable,
    onUpdate: ({ editor }) => {
      if (outputHTML) {
        onChange?.(editor.getHTML());
      } else {
        onChange?.(editor.state.doc.toJSON());
      }
    },
  });

  // Shared import handler — used by both EditorRef.import and the toolbar button.
  // Dynamic import keeps mammoth (~100KB+) out of the main bundle until first use.
  const handleImportFile = useCallback(async (file: File) => {
    if (!editor) return;
    const {importWORD} = await import('@textory/extension-import-word');
    return importWORD({
      file,
      editor,
      imageUploadHandler: mergedProps.imageProps?.onImageUpload,
    });
  }, [editor, mergedProps.imageProps]);

  useImperativeHandle(ref, () => ({
    export: (options: ExportOptions = {}) => {
      const content = options.data?.content ?? editor?.getJSON();
      return exportWORD({
        ...options,
        data: {
          title: options.data?.title ?? mergedProps.title,
          content,
        },
      });
    },
    import: handleImportFile,
  }), [editor, mergedProps.title, handleImportFile]);

  if (process.env.NODE_ENV === 'development') {
    (window as any).__EASY_EDITOR__ = editor;
  }

  // features 只在 mount 时生效，运行时变更不会重新加载扩展
  const initialFeaturesRef = useRef<string | undefined>(undefined);
  if (initialFeaturesRef.current === undefined) {
    initialFeaturesRef.current = JSON.stringify(mergedProps.features ?? {});
  }
  useEffect(() => {
    const current = JSON.stringify(mergedProps.features ?? {});
    if (current !== initialFeaturesRef.current) {
      console.warn(
        '[EasyEditor] features 只在初始化时生效，运行时修改不会重新加载扩展。' +
          '如需切换，请给 <Editor> 加 key 强制 remount，例如：<Editor key={JSON.stringify(features)} features={features} />',
      );
    }
  }, [mergedProps.features]);

  return (
    <EditorProvider editor={editor} props={mergedProps}>
      <div className={cx('textory', className)} style={style}>
        {intlInit && editor.isEditable && (
          <EditorToolbar
            editor={editor}
            imageProps={mergedProps.imageProps}
            exportProps={mergedProps.exportProps}
            onImportFile={isImportWordEnabled ? handleImportFile : undefined}
          />
        )}
        <EditorContent
          autoFocus={autoFocus}
          editor={editor}
          className="textory-body"
        >
          {isOutlineEnabled && <OutlineView editor={editor} />}
        </EditorContent>
        <MessageContainer />
        <TableBubbleMenu editor={editor} />
        <EditorFilePreview editor={editor} />
      </div>
    </EditorProvider>
  );
});

Editor.displayName = 'Editor';

export default Editor;
