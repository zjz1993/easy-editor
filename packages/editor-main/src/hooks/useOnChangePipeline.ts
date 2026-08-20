import {useCallback, useEffect, useRef} from 'react';
import type {Editor as TiptapEditor, EditorEvents, JSONContent} from '@tiptap/core';

/**
 * onChange 的序列化防抖间隔。getHTML + toJSON 是 O(全文) 的操作，
 * 逐键执行在大文档（尤其是巨型表格）下会造成打字卡顿；
 * blur / getData() / 组件卸载时会同步 flush，不丢最后一次输入。
 */
const ON_CHANGE_DEBOUNCE_MS = 300;

export interface OnChangePipeline {
  /** 最新一次序列化的正文，getData() 直接读 */
  contentRef: {current: {html: string; json: JSONContent}};
  /** DocTitle 输入的最新标题，getData()/onChange 第二参数用 */
  titleContentRef: {current: string};
  /** 接给 useTiptapWithSync 的 onUpdate；防抖 300ms 后统一序列化 emit */
  handleEditorUpdate: (props: EditorEvents['update']) => void;
  /** 立即序列化并 emit（有 pending 才执行）；getData/blur/卸载时调用 */
  flushOnChange: (ed: TiptapEditor) => void;
}

/**
 * onChange 序列化防抖管线。
 *
 * 从 root.tsx 抽出的职责域：
 * - 打字期间只置 pending + 重置 timer，停顿 300ms 后才执行 getHTML/toJSON
 * - contentRef/titleContentRef 缓存最新序列化结果，供 EditorRef.getData 读取
 * - 注意：不能在 composition 期间强制 flush，否则会打断 IME
 *
 * blur / 卸载的 flush 兜底在 useFlushOnChangeOnBlur（依赖 editor 实例，
 * 需在 useTiptapWithSync 之后调用，与本 hook 的调用顺序相反）。
 */
export function useOnChangePipeline(
  onChange: ((content: {json: JSONContent; html: string}, title: string) => void) | undefined,
): OnChangePipeline {
  const contentRef = useRef<{html: string; json: JSONContent}>({html: '', json: {}});
  const titleContentRef = useRef('');
  // timer + pending 标记 + 最新回调引用（避免闭包过期）
  const onChangeTimerRef = useRef<number | undefined>(undefined);
  const onChangePendingRef = useRef(false);
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  /**
   * 立即序列化并触发 onChange。既是防抖的最终执行体，
   * 也是 blur / getData / 卸载时的 flush 入口。
   */
  const flushOnChange = useCallback((ed: TiptapEditor) => {
    window.clearTimeout(onChangeTimerRef.current);
    if (!onChangePendingRef.current) return;
    onChangePendingRef.current = false;
    if (ed.isDestroyed) return;
    const content = {html: ed.getHTML(), json: ed.state.doc.toJSON()};
    contentRef.current = content;
    onChangeRef.current?.(content, titleContentRef.current);
  }, []);

  const handleEditorUpdate = useCallback(
    ({editor}: EditorEvents['update']) => {
      onChangePendingRef.current = true;
      window.clearTimeout(onChangeTimerRef.current);
      onChangeTimerRef.current = window.setTimeout(
        () => flushOnChange(editor),
        ON_CHANGE_DEBOUNCE_MS,
      );
    },
    [flushOnChange],
  );

  return {contentRef, titleContentRef, handleEditorUpdate, flushOnChange};
}

/**
 * onChange 防抖的兜底：blur 时立即 flush（点击外部即拿到最新内容），
 * 卸载时清掉 timer 并同步 flush，保证 autosave 场景不丢最后一段输入。
 * 必须在 useTiptapWithSync 之后调用（依赖 editor 实例）。
 */
export function useFlushOnChangeOnBlur(
  editor: TiptapEditor | null,
  flushOnChange: (ed: TiptapEditor) => void,
) {
  useEffect(() => {
    if (!editor) return;
    const handleBlur = () => flushOnChange(editor);
    editor.on('blur', handleBlur);
    return () => {
      editor.off('blur', handleBlur);
      flushOnChange(editor);
    };
  }, [editor, flushOnChange]);
}
