import {MessageContainer} from '@textory/editor-common';
import {get, isUndefined} from 'lodash-es';
import {EditorToolbar} from '@textory/editor-toolbar';
import cx from 'classnames';
import {forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState} from 'react';
import type {JSONContent} from '@tiptap/core';
import {useEditorProps} from './hooks/useEditorProps.ts';
import {EditorProvider, type TTextoryEditorProps} from '@textory/context';
import {useTiptapWithSync} from './hooks/useTiptapWithSync.ts';
import {useOnChangePipeline, useFlushOnChangeOnBlur} from './hooks/useOnChangePipeline.ts';
import {useSearchReplaceUI} from './hooks/useSearchReplaceUI.ts';
import {useFeaturesWarning} from './hooks/useFeaturesWarning.ts';
import {useEditorExtensions} from './hooks/useEditorExtensions.ts';
import {exportWORD, type ExportOptions} from '@textory/extension-export';
import {DocTitle} from './components/Title';
import {
  BubbleLayer,
  CharacterCountLayer,
  DragHandleLayer,
  EditorStage,
  FilePreviewLayer,
  SearchLayer,
  TextBubbleLayer,
} from './layers';
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

const Editor = forwardRef<EditorRef, TTextoryEditorProps>((props, ref) => {
  const imgUploader = useRef<any>();
  const fileUploader = useRef<any>();
  const videoUploader = useRef<any>();
  const mergedProps: TTextoryEditorProps = useEditorProps(props, DEFAULT_PROPS);
  const [isTitleFocused, setIsTitleFocused] = useState(false);
  const {
    content,
    autoFocus,
    className,
    style,
    title,
    transformContent,
    onEditorReady,
  } = mergedProps;

  // onChange 防抖管线（须在 useTiptapWithSync 之前：onUpdate 需要 handleEditorUpdate）
  const {contentRef, titleContentRef, handleEditorUpdate, flushOnChange} =
    useOnChangePipeline(mergedProps.onChange);
  const {
    isSearchOpen,
    isSearchReplaceVisible,
    handleSearchHotkey,
    handleCloseSearch,
    handleToggleReplaceRow,
  } = useSearchReplaceUI();
  useFeaturesWarning(mergedProps.features);

  // 扩展集合 + features 开关（memo 化，见 P1-3）
  const {
    extensions,
    isOutlineEnabled,
    isImportWordEnabled,
    isTextBubbleEnabled,
    isFileUploadEnabled,
    isVideoUploadEnabled,
    isCharacterCountEnabled,
    isSearchReplaceEnabled,
  } = useEditorExtensions(props, mergedProps);

  const editor = useTiptapWithSync({
    editorProps: {
      imgUploader,
      fileUploader,
      videoUploader,
    },
    autofocus: !isUndefined(autoFocus) ? 'end' : undefined,
    extensions,
    content,
    transformContent,
    editable: mergedProps.editable,
    onUpdate: handleEditorUpdate,
  });

  // onChange 防抖兜底（须在 useTiptapWithSync 之后：依赖 editor 实例）
  useFlushOnChangeOnBlur(editor, flushOnChange);

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
      // 有 pending 的防抖内容时同步 flush，保证命令式读取不拿到旧值
      flushOnChange(editor);
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
    // titleContentRef/contentRef 由 useOnChangePipeline 返回（引用恒定），
    // 显式列入以通过 exhaustive-deps 静态检查
  }), [
    editor,
    mergedProps.title,
    handleImportFile,
    flushOnChange,
    contentRef,
    titleContentRef,
  ]);

  // 通知外部 editor 已就绪。供 @textory/standalone UMD 桥接层等非 React 集成场景使用。
  // editor 在 useTiptapWithSync 首次创建后不会重新创建，所以会触发一次。
  useEffect(() => {
    if (editor && onEditorReady) {
      onEditorReady(editor);
    }
  }, [editor, onEditorReady]);

  if (process.env.NODE_ENV === 'development') {
    (window as any).__EASY_EDITOR__ = editor;
  }

  return (
    <EditorProvider editor={editor} props={mergedProps}>
      <div
        className={cx('textory', className)}
        style={style}
        onKeyDown={isSearchReplaceEnabled && editor.isEditable ? handleSearchHotkey : undefined}
      >
        {editor.isEditable && (
          <EditorToolbar
            editor={editor}
            imageProps={mergedProps.imageProps}
            fileProps={isFileUploadEnabled ? mergedProps.fileProps : undefined}
            videoProps={isVideoUploadEnabled ? mergedProps.videoProps : undefined}
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
        {editor.isEditable && <BubbleLayer editor={editor} />}
        {editor.isEditable && <DragHandleLayer editor={editor} />}
        {isTextBubbleEnabled && editor.isEditable && <TextBubbleLayer editor={editor} />}
        {<FilePreviewLayer editor={editor} />}
        {isCharacterCountEnabled && (
          <CharacterCountLayer editor={editor} maxCount={mergedProps.maxCount} />
        )}
        {isSearchReplaceEnabled && editor.isEditable && (
          <SearchLayer
            editor={editor}
            open={isSearchOpen}
            showReplace={isSearchReplaceVisible}
            onClose={handleCloseSearch}
            onToggleReplace={handleToggleReplaceRow}
          />
        )}
      </div>
    </EditorProvider>
  );
});

Editor.displayName = 'Editor';

export default Editor;
