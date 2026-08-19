import { Editor } from '@tiptap/core';
import { Document } from '@tiptap/extension-document';
import { Heading } from '@tiptap/extension-heading';
import { Paragraph } from '@tiptap/extension-paragraph';
import { Text } from '@tiptap/extension-text';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { OutlineExtension } from './OutlineExtension';

function createEditor(content?: string) {
  return new Editor({
    extensions: [Document, Paragraph, Text, Heading, OutlineExtension],
    content,
  });
}

// tiptap v3 在 setTimeout(0) 里异步 emit 'create'（触发扩展 onCreate），
// fake timers 下需要先推进 1ms 让初始钩子跑完
function flushCreateHook() {
  vi.advanceTimersByTime(1);
}

function outlineSnapshot(editor: Editor) {
  const simplify = (items: any[]): any[] =>
    items.map(i => ({ level: i.level, text: i.text, children: simplify(i.children) }));
  return simplify(editor.storage.outline.outline);
}

describe('OutlineExtension 初始计算', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('onCreate 立即从初始 content 计算大纲（不受防抖影响）', () => {
    const editor = createEditor('<h1>标题一</h1><h2>标题二</h2><p>正文</p>');
    flushCreateHook();
    expect(outlineSnapshot(editor)).toEqual([
      {
        level: 1,
        text: '标题一',
        children: [{ level: 2, text: '标题二', children: [] }],
      },
    ]);
    editor.destroy();
  });

  it('无标题文档的大纲为空数组', () => {
    const editor = createEditor('<p>只有正文</p>');
    flushCreateHook();
    expect(outlineSnapshot(editor)).toEqual([]);
    editor.destroy();
  });
});

describe('OutlineExtension 防抖', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('编辑后延迟 300ms 才重算大纲', () => {
    const editor = createEditor('<h1>标题一</h1>');
    flushCreateHook();
    editor.commands.setTextSelection(1);
    editor.commands.insertContent('前缀');

    // 停顿前 storage 仍是旧值
    expect(outlineSnapshot(editor)).toEqual([
      { level: 1, text: '标题一', children: [] },
    ]);

    vi.advanceTimersByTime(300);
    expect(outlineSnapshot(editor)).toEqual([
      { level: 1, text: '前缀标题一', children: [] },
    ]);
    editor.destroy();
  });

  it('destroy 清掉 pending 计时器，不抛错且不再更新 storage', () => {
    const editor = createEditor('<h1>标题一</h1>');
    flushCreateHook();
    editor.commands.setTextSelection(1);
    editor.commands.insertContent('前缀');
    editor.destroy();

    expect(() => vi.advanceTimersByTime(300)).not.toThrow();
  });
});
