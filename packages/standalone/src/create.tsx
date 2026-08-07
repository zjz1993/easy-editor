/**
 * `Textory.create()` 工厂实现。
 *
 * 职责：
 * 1. `ReactDOM.createRoot(element).render(<Container .../>)` 挂载 React 子树
 * 2. 命令队列 —— editor 未就绪时所有方法调用排队，`onEditorReady` 后 flush
 * 3. destroy 保护 —— 标记失效后所有方法 `console.warn`，不 throw 不静默
 * 4. 暴露 `instance.editor` 原始 Tiptap Editor 引用作为 escape hatch
 */
import {createRoot, type Root} from 'react-dom/client';
import type {Editor as TiptapEditor} from '@tiptap/react';
import Container from './container';
import type {TextoryInstance, TextoryOptions} from './types';

interface PendingTask {
  fn: () => void;
  name: string;
}

export function createTextoryInstance(
  element: HTMLElement,
  initialOptions: TextoryOptions = {},
): TextoryInstance {
  let root: Root | null = createRoot(element);
  const editorRef: {current: TiptapEditor | null} = {current: null};
  let pendingQueue: PendingTask[] = [];
  let destroyed = false;
  let latestOptions: TextoryOptions = initialOptions;

  const handleEditorReady = (editor: TiptapEditor) => {
    if (destroyed) return;
    editorRef.current = editor;
    // flush 命令队列
    const queue = pendingQueue;
    pendingQueue = [];
    for (const task of queue) {
      try {
        task.fn();
      } catch (err) {
        console.warn(`[Textory] queued command "${task.name}" failed:`, err);
        latestOptions.onError?.(err as Error);
      }
    }
    // 触发用户 onCreate
    try {
      latestOptions.onCreate?.();
    } catch (err) {
      console.warn('[Textory] onCreate callback threw:', err);
    }
  };

  // setState 注册：由 Container 在 mount 时调用
  let setOptionsExternal: ((partial: Partial<TextoryOptions>) => void) | null =
    null;
  const registerSetOptions = (set: (partial: Partial<TextoryOptions>) => void) => {
    setOptionsExternal = set;
  };

  // 同步 render：React 18 createRoot().render() 立即返回，commit 异步
  root.render(
    <Container
      initialOptions={initialOptions}
      onEditorReady={handleEditorReady}
      registerSetOptions={registerSetOptions}
    />,
  );

  // ────────────── 命令包装 ──────────────
  /**
   * 把一个 editor 操作包成「editor 未就绪则排队」的形态。
   * destroy 后所有调用 console.warn，不执行。
   */
  const withEditor = <T,>(name: string, fn: (editor: TiptapEditor) => T): T | undefined => {
    if (destroyed) {
      console.warn(`[Textory] instance destroyed; "${name}" ignored`);
      return undefined;
    }
    if (editorRef.current) {
      try {
        return fn(editorRef.current);
      } catch (err) {
        console.warn(`[Textory] command "${name}" failed:`, err);
        latestOptions.onError?.(err as Error);
        return undefined;
      }
    }
    pendingQueue.push({
      name,
      fn: () => {
        if (editorRef.current && !destroyed) {
          try {
            fn(editorRef.current);
          } catch (err) {
            console.warn(`[Textory] command "${name}" failed:`, err);
            latestOptions.onError?.(err as Error);
          }
        }
      },
    });
    return undefined;
  };

  // ────────────── 公开 API ──────────────
  const instance: TextoryInstance = {
    getHTML: () =>
      withEditor('getHTML', (editor) => editor.getHTML()) ?? '',
    setHTML: (html: string) =>
      withEditor('setHTML', (editor) => {
        // 直接调 Tiptap command，跳过 React state 同步链路
        // 详见 .ai/standalone-umd.md 「setHTML 跳过 React state 的合理性」
        editor.commands.setContent(html);
      }),
    getJSON: () =>
      withEditor('getJSON', (editor) => editor.getJSON()) ?? ({} as any),
    setJSON: (json) =>
      withEditor('setJSON', (editor) => {
        editor.commands.setContent(json);
      }),
    focus: () => withEditor('focus', (editor) => editor.commands.focus()),
    blur: () => withEditor('blur', (editor) => editor.commands.blur()),
    clear: () =>
      withEditor('clear', (editor) => editor.commands.clearContent(true)),

    setOptions: (partial: Partial<TextoryOptions>) => {
      if (destroyed) {
        console.warn('[Textory] instance destroyed; "setOptions" ignored');
        return;
      }
      latestOptions = {...latestOptions, ...partial};
      if (setOptionsExternal) {
        setOptionsExternal(partial);
      } else {
        // Container 尚未 mount，直接合并到 initialOptions
        // 在 root.render 之前合并是安全的（Container useState 用最新 initialOptions）
        Object.assign(initialOptions, partial);
      }
    },

    destroy: () => {
      if (destroyed) {
        console.warn('[Textory] instance already destroyed');
        return;
      }
      destroyed = true;
      pendingQueue = [];
      editorRef.current = null;
      if (root) {
        root.unmount();
        root = null;
      }
    },

    get editor() {
      return editorRef.current;
    },
  };

  return instance;
}
