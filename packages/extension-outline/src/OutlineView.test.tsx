import {act, cleanup, render, within} from '@testing-library/react';
import {Editor} from '@tiptap/core';
import {Document} from '@tiptap/extension-document';
import {Heading} from '@tiptap/extension-heading';
import {Paragraph} from '@tiptap/extension-paragraph';
import {Text} from '@tiptap/extension-text';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {OutlineExtension} from './OutlineExtension';
import {OutlineView} from './OutlineView';

// OutlineView 只用到 editor-common 的三个 UI 符号，替换为最小 stub，
// 避免 intl 初始化与 iconfont 副作用
vi.mock('@textory/editor-common', () => ({
  Tooltip: ({children}: {children?: unknown}) => <>{children}</>,
  Iconfont: () => null,
  IntlComponent: {get: (key: string) => key},
}));

interface MountedEditor {
  editor: Editor;
  dispose: () => void;
}

/**
 * 编辑器正文本身也渲染 heading 文本，queryByText 会同时命中两者，
 * 因此断言统一收窄到 `.textory-outline` 容器内。
 */
function getOutlinePanel(): HTMLElement | null {
  return document.querySelector('.textory-outline');
}

/** 创建真实 tiptap Editor 并把 view.dom 挂进 `.textory-body` 容器。 */
function mountEditor(content: string): MountedEditor {
  const host = document.createElement('div');
  host.className = 'textory-body';
  document.body.appendChild(host);
  const editor = new Editor({
    element: host,
    extensions: [Document, Paragraph, Text, Heading, OutlineExtension],
    content,
  });
  return {
    editor,
    dispose: () => {
      editor.destroy();
      host.remove();
    },
  };
}

describe('OutlineView 初始同步时序', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it('初始 content 的大纲在 create 事件后自动出现，无需手动编辑', () => {
    const {editor, dispose} = mountEditor('<h1>标题一</h1><p>正文</p>');
    try {
      render(<OutlineView editor={editor} />);

      // 首挂载时 tiptap 的 'create'（setTimeout 0）尚未触发，
      // OutlineExtension.onCreate 还没算出初始大纲
      expect(getOutlinePanel()).toBeNull();

      // create 触发 → 初始大纲写入 storage → OutlineView 重新同步
      act(() => {
        vi.advanceTimersByTime(1);
      });

      const panel = getOutlinePanel();
      expect(panel).toBeTruthy();
      expect(within(panel as HTMLElement).getByText('标题一')).toBeTruthy();
    } finally {
      dispose();
    }
  });

  it('create 已触发后挂载（remount / 后启用 outline）立即显示大纲', () => {
    const {editor, dispose} = mountEditor('<h1>标题一</h1><p>正文</p>');
    try {
      // 先让 create 跑完，模拟编辑器早已初始化、OutlineView 后挂载
      vi.advanceTimersByTime(1);

      render(<OutlineView editor={editor} />);
      const panel = getOutlinePanel();
      expect(panel).toBeTruthy();
      expect(within(panel as HTMLElement).getByText('标题一')).toBeTruthy();
    } finally {
      dispose();
    }
  });
});
