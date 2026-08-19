import { Editor } from '@tiptap/core';
import { Document } from '@tiptap/extension-document';
import { Paragraph } from '@tiptap/extension-paragraph';
import { Text } from '@tiptap/extension-text';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CharacterCount, type CharacterCountOptions } from './character-count';

function createEditor(onUpdate?: CharacterCountOptions['onUpdate']) {
  return new Editor({
    extensions: [
      Document,
      Paragraph,
      Text,
      CharacterCount.configure({ onUpdate }),
    ],
    content: '<p>你好世界</p>',
  });
}

// tiptap v3 在 setTimeout(0) 里异步 emit 'create'（触发扩展 onCreate），
// fake timers 下需要先推进 1ms 让初始钩子跑完
function flushCreateHook() {
  vi.advanceTimersByTime(1);
}

describe('CharacterCount 初始计数', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('onCreate 立即上报一次（不受防抖影响）', () => {
    const spy = vi.fn();
    const editor = createEditor(spy);
    flushCreateHook();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith({ characters: 4, words: 4 });
    editor.destroy();
  });

  it('storage.characters/words 保持同步惰性求值', () => {
    const editor = createEditor();
    flushCreateHook();
    expect(editor.storage.characterCount.characters()).toBe(4);
    expect(editor.storage.characterCount.words()).toBe(4);
    editor.destroy();
  });
});

describe('CharacterCount 防抖', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('连续输入只触发一次回调，且计数为最终值', () => {
    const spy = vi.fn();
    const editor = createEditor(spy);
    flushCreateHook();
    spy.mockClear();

    editor.commands.setTextSelection(9);
    editor.commands.insertContent('ABC');
    editor.commands.insertContent('DE');
    expect(spy).not.toHaveBeenCalled();

    vi.advanceTimersByTime(300);
    expect(spy).toHaveBeenCalledTimes(1);
    // 你好世界(4字) + ABCDE(1词) => 9 字符 / 5 词
    expect(spy).toHaveBeenCalledWith({ characters: 9, words: 5 });
    editor.destroy();
  });

  it('停顿未满 300ms 内的后续输入会重置计时', () => {
    const spy = vi.fn();
    const editor = createEditor(spy);
    flushCreateHook();
    spy.mockClear();

    editor.commands.setTextSelection(9);
    editor.commands.insertContent('A');
    vi.advanceTimersByTime(200);
    editor.commands.insertContent('B');
    vi.advanceTimersByTime(200);
    expect(spy).not.toHaveBeenCalled();

    vi.advanceTimersByTime(100);
    expect(spy).toHaveBeenCalledTimes(1);
    editor.destroy();
  });

  it('destroy 清掉 pending 计时器，不再触发回调', () => {
    const spy = vi.fn();
    const editor = createEditor(spy);
    flushCreateHook();
    spy.mockClear();

    editor.commands.setTextSelection(9);
    editor.commands.insertContent('A');
    editor.destroy();

    vi.advanceTimersByTime(300);
    expect(spy).not.toHaveBeenCalled();
  });
});
