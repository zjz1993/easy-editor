import {BLOCK_TYPES, wrapBlockExtensions} from '@textory/editor-utils';
import {MessageContainer} from '@textory/editor-common';
import {extendWithoutDeprecatedDefaultOptions} from '@textory/editor-utils';
import {get, isUndefined} from 'lodash-es';
import {EditorToolbar} from '@textory/editor-toolbar';
import {Bold} from '@textory/extension-bold';
import {EditorContent} from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import cx from 'classnames';
import {forwardRef, memo, useCallback, useEffect, useImperativeHandle, useRef, useState} from 'react';
import type {Editor as TiptapEditor, JSONContent} from '@tiptap/core';
import {CodeBlock} from '@textory/extension-code-block';
import {Indent} from '@textory/extension-indent';
import {CustomLink} from '@textory/extension-link';
import {TaskItem, TaskList} from '@textory/extension-task-item';
import {Color} from '@tiptap/extension-color';
import {Highlight} from '@textory/extension-highlight';
import {AttachmentExtension} from '@textory/extension-image';
import {Table, TableBubbleMenu, TableCell, TableHeader, TableRow,} from '@textory/extension-table';
import {Placeholder} from './extension/Placeholder';
import {DocMetaExtension} from './extension/DocMeta';
import {TextAlign} from '@tiptap/extension-text-align';
import {TextStyle} from '@tiptap/extension-text-style';
import BulletList from './BulletList/bullet-list.ts';
import {ListItem} from './BulletList/list-item.ts'; // import {UniqueIDExtension} from './extension/UniqueIDExtension/index.ts';
import useIntlLoaded from './hooks/useIntlLoaded.ts';
import EditorFilePreview from './components/FilePreview/EditorFilePreview';
import Underline from '@tiptap/extension-underline';
import {OutlineExtension, OutlineView} from '@textory/extension-outline';
import {useEditorProps} from './hooks/useEditorProps.ts';
import {EditorProvider, type TTextoryEditorProps} from '@textory/context';
import {useTiptapWithSync} from './hooks/useTiptapWithSync.ts';
import {exportWORD, type ExportOptions} from '@textory/extension-export';
import HorizontalRule from '@tiptap/extension-horizontal-rule'
import UniqueID from '@tiptap/extension-unique-id'
import {DocTitle} from './components/Title';
import {DEFAULT_PROPS} from "./const/index.ts";
/**
 * Ref handle exposed by the Editor component.
 * Allows parent components to call imperative methods.
 */
export interface EditorRef {
  getData:() => {title: string; content: {html: string; json: JSONContent}}
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

/**
 * 隔离后的编辑器主舞台（EditorContent + OutlineView）。
 *
 * 这些子树本身不依赖 root.tsx 里的 UI state（如 isTitleFocused），用 memo
 * 避免父级无关 re-render 拖累 ProseMirror 同步渲染路径。
 *
 * 详见 .ai/tiptap-performance-guide.md 第 1 节「Isolate the editor in a
 * separate component」与 .ai/performance-issues.md P1-1。
 */
interface EditorStageProps {
  editor: TiptapEditor;
  autoFocus?: boolean;
  isOutlineEnabled: boolean;
}
const EditorStage = memo<EditorStageProps>(({ editor, autoFocus, isOutlineEnabled }) => (
  <EditorContent autoFocus={autoFocus} editor={editor} className="textory-body">
    {isOutlineEnabled && <OutlineView editor={editor} />}
  </EditorContent>
));
EditorStage.displayName = 'EditorStage';

/**
 * 隔离 TableBubbleMenu —— 仅依赖 editor 实例。
 */
const BubbleLayer = memo<{ editor: TiptapEditor }>(({ editor }) => (
  <TableBubbleMenu editor={editor} />
));
BubbleLayer.displayName = 'BubbleLayer';

/**
 * 隔离 EditorFilePreview —— 仅依赖 editor 实例。
 */
const FilePreviewLayer = memo<{ editor: TiptapEditor }>(({ editor }) => (
  <EditorFilePreview editor={editor} />
));
FilePreviewLayer.displayName = 'FilePreviewLayer';


const Editor = forwardRef<EditorRef, TTextoryEditorProps>((props, ref) => {
  const imgUploader = useRef<any>();
  const fileUploader = useRef<any>();
  const { intlInit } = useIntlLoaded();
  const { CL, OL, UL, P, H, CLI, LI, QUOTE, HR, TL, IMG, TABLE } = BLOCK_TYPES;
  const listGroup = `${UL}|${OL}|${CL}`;
  const mergedProps: TTextoryEditorProps = useEditorProps(props, DEFAULT_PROPS);
  const [isTitleFocused, setIsTitleFocused] = useState(false);
  const titleContentRef = useRef('');
  const contentRef = useRef<{ html: string; json: JSONContent; }>({html:'', json: {}});
  const {
    content,
    onChange,
    autoFocus,
    placeholder,
    className,
    style,
    title,
  } = mergedProps;
  const isOutlineEnabled = mergedProps.features?.outline ?? true;
  const isImportWordEnabled = mergedProps.features?.importWord ?? false;
  // DocMeta 初始 title：从顶层 title prop 拿。
  // 即便 DocTitle 不渲染（showTitle=false），export 仍能从 storage 读到这个回退值。
  const initialDocTitle = typeof title === 'string' ? title : '';
  const extensions = [
    StarterKit.configure({
      bold: false,
      codeBlock: false,
      underline: false,
      link: false,
      horizontalRule: false,
    }),
    Bold,
    UniqueID.configure({
      types: 'all',
    }),
    extendWithoutDeprecatedDefaultOptions(HorizontalRule, {
      name: BLOCK_TYPES.HR,
    }),
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
      DocMetaExtension.configure({ title: initialDocTitle }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    editable: mergedProps.editable,
    onUpdate: ({ editor }) => {
      const content = {html: editor.getHTML(), json: editor.state.doc.toJSON()}
      contentRef.current = content;
      onChange?.(content, titleContentRef.current);
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
    getData: () => {
      return {
        title: titleContentRef.current,
        content: contentRef.current,
      }
    },
    export: (options: ExportOptions = {}) => {
      const content = options.data?.content ?? editor?.getJSON();
      // 优先用调用方传入的 title，其次读 editor.storage.docMeta.title
      // （由 DocTitle 用户输入同步），最后回退到顶层 title prop。
      return exportWORD({
        ...options,
        data: {
          title: options.data?.title
            ?? editor?.storage.docMeta?.title
            ?? mergedProps.title,
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
            disabled={isTitleFocused}
          />
        )}
        {get(mergedProps,'titleProps.showTitle') && (
          <DocTitle
            {...mergedProps.titleProps}
            title={title}
            autoFocus={autoFocus}
            onChange={(val) => {
              const next = val ?? '';
              titleContentRef.current = next;
              // 同步到 editor.storage.docMeta.title，让 export 等场景能读到最新值
              if (editor) {
                editor.storage.docMeta.title = next;
              }
              mergedProps.titleProps?.onTitleChange?.(val);
            }}
            onFocus={() => {
              setIsTitleFocused(true);
              mergedProps.titleProps?.onFocus?.();
            }}
            onBlur={() => {
              setIsTitleFocused(false);
              mergedProps.titleProps?.onBlur?.();
            }}
          />
        )}
        <EditorStage
          editor={editor}
          autoFocus={autoFocus}
          isOutlineEnabled={isOutlineEnabled}
        />
        <MessageContainer />
        <BubbleLayer editor={editor} />
        <FilePreviewLayer editor={editor} />
      </div>
    </EditorProvider>
  );
});

Editor.displayName = 'Editor';

export default Editor;
