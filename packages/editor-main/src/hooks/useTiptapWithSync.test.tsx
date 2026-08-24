import {renderHook} from '@testing-library/react';
import type {Editor} from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {useTiptapWithSync} from './useTiptapWithSync';

const EXTENSIONS = [StarterKit];

/**
 * 初始挂载若在 passive effect 里重复 setContent，dispatch 会全量重建 doc：
 * 初始 content 含 React NodeView（图片/视频/代码块等）时，重建过程中的
 * flushSync 撞上 React 提交上下文，触发 "flushSync was called from inside
 * a lifecycle method" 警告。这里统计 docChanged 事务来锁定该行为。
 */
let capturedEditor: Editor | null = null;
let docChangeCount = 0;

function useTestHook(content: unknown) {
  const editor = useTiptapWithSync({
    content,
    editable: true,
    extensions: EXTENSIONS,
  });
  // 渲染期间注册监听：晚于渲染（如 render 返回后）注册会漏掉 passive
  // effect 里的 setContent dispatch
  if (editor && editor !== capturedEditor) {
    capturedEditor = editor;
    docChangeCount = 0;
    editor.on('beforeTransaction', ({transaction}) => {
      if (transaction.docChanged) docChangeCount += 1;
    });
  }
  return editor;
}

describe('useTiptapWithSync content 同步', () => {
  beforeEach(() => {
    capturedEditor = null;
    docChangeCount = 0;
  });

  afterEach(() => {
    capturedEditor?.destroy();
    capturedEditor = null;
  });

  it('初始 content 已随 useEditor 构造应用，挂载时不重复 setContent', () => {
    const {result} = renderHook(() => useTestHook('<h1>标题一</h1>'));
    const editor = result.current;
    expect(editor).toBeTruthy();
    expect(editor!.getHTML()).toContain('标题一');
    // 修复前：初始挂载会对同一份 content 再跑一次全量 setContent（docChanged）
    expect(docChangeCount).toBe(0);
  });

  it('可选字段不传（undefined）不覆盖 Tiptap 默认 options，构造不崩溃', () => {
    // 直接调用 hook、不传 editorProps / autofocus：修复前 undefined 会覆盖
    // editorProps 默认 {}，Editor 构造期读 editorProps.dispatchTransaction 即崩
    const {result} = renderHook(() =>
      useTiptapWithSync({
        content: '<h1>标题一</h1>',
        editable: true,
        extensions: EXTENSIONS,
        autofocus: undefined,
        editorProps: undefined,
      }),
    );
    expect(result.current).toBeTruthy();
    expect(result.current!.isFocused).toBe(false);
  });

  it('content 变化时正常同步', () => {
    const {result, rerender} = renderHook(
      ({content}: {content: string}) => useTestHook(content),
      {initialProps: {content: '<h1>标题一</h1>'}},
    );
    rerender({content: '<h1>新标题</h1>'});
    expect(result.current!.getHTML()).toContain('新标题');
    expect(docChangeCount).toBe(1);
  });

  it('语义相同的 content 回流不重复 setContent（受控防抢断）', () => {
    const {rerender} = renderHook(({content}: {content: string}) => useTestHook(content), {
      initialProps: {content: '<h1>标题一</h1>'},
    });
    // 新字符串引用、相同值，模拟父组件受控回流
    const sameValue = ['<h1>', '标题一', '</h1>'].join('');
    rerender({content: sameValue});
    expect(docChangeCount).toBe(0);
  });
});
