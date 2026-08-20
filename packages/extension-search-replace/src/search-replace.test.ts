import {Editor} from '@tiptap/core';
import {UndoRedo} from '@tiptap/extensions';
import {Document} from '@tiptap/extension-document';
import {Paragraph} from '@tiptap/extension-paragraph';
import {Text} from '@tiptap/extension-text';
import {describe, expect, it} from 'vitest';
import {
  buildSearchRegex,
  escapeRegExp,
  findMatches,
  SearchReplace,
  searchReplacePluginKey,
} from './search-replace';

function createHeadlessEditor(content = '<p>hello world, hello editor</p>') {
  return new Editor({
    extensions: [Document, Paragraph, Text, UndoRedo, SearchReplace],
    content,
  });
}

function getPluginState(editor: Editor) {
  const state = searchReplacePluginKey.getState(editor.state);
  if (!state) throw new Error('searchReplace plugin state missing');
  return state;
}

describe('buildSearchRegex / escapeRegExp', () => {
  it('特殊字符按字面量转义', () => {
    expect(escapeRegExp('a.b*c')).toBe('a\\.b\\*c');
    const regex = buildSearchRegex('a.b', {caseSensitive: false, wholeWord: false})!;
    expect(regex.test('xa.by')).toBe(true);
    expect(regex.test('aZb')).toBe(false);
  });

  it('大小写敏感开关', () => {
    expect(buildSearchRegex('abc', {caseSensitive: false, wholeWord: false})!.test('ABC')).toBe(true);
    expect(buildSearchRegex('abc', {caseSensitive: true, wholeWord: false})!.test('ABC')).toBe(false);
  });

  it('全词匹配加边界', () => {
    const regex = buildSearchRegex('cat', {caseSensitive: false, wholeWord: true})!;
    expect(regex.test('a cat here')).toBe(true);
    expect(regex.test('concat')).toBe(false);
  });

  it('空搜索词返回 null', () => {
    expect(buildSearchRegex('', {caseSensitive: false, wholeWord: false})).toBeNull();
  });
});

describe('findMatches', () => {
  it('收集所有匹配区间，不跨节点', () => {
    const editor = createHeadlessEditor('<p>foo bar foo</p>');
    const matches = findMatches(editor.state.doc, 'foo', {
      caseSensitive: false,
      wholeWord: false,
    });
    expect(matches).toHaveLength(2);
    // 第二段匹配仍是基于各自 text node 的绝对位置
    expect(matches[1].from).toBeGreaterThan(matches[0].to);
    editor.destroy();
  });
});

describe('SearchReplace 命令', () => {
  it('setSearchTerm 更新 matches 与 activeIndex', () => {
    const editor = createHeadlessEditor();
    editor.commands.setSearchTerm('hello');
    const state = getPluginState(editor);
    expect(state.matches).toHaveLength(2);
    expect(state.activeIndex).toBe(0);
    expect(editor.storage.searchReplace.resultCount).toBe(2);
    editor.destroy();
  });

  it('空搜索词清除匹配', () => {
    const editor = createHeadlessEditor();
    editor.commands.setSearchTerm('hello');
    editor.commands.setSearchTerm('');
    expect(getPluginState(editor).matches).toHaveLength(0);
    editor.destroy();
  });

  it('goToMatch 循环跳转并更新选区', () => {
    const editor = createHeadlessEditor();
    editor.commands.setSearchTerm('hello');
    editor.commands.goToMatch('next');
    expect(getPluginState(editor).activeIndex).toBe(1);
    editor.commands.goToMatch('next');
    // 循环回第一项
    expect(getPluginState(editor).activeIndex).toBe(0);
    editor.commands.goToMatch('prev');
    expect(getPluginState(editor).activeIndex).toBe(1);
    const {from} = editor.state.selection;
    expect(editor.state.doc.textBetween(from, from + 5)).toBe('hello');
    editor.destroy();
  });

  it('大小写 / 全词开关改变匹配数', () => {
    const editor = createHeadlessEditor('<p>Cat cat concat</p>');
    editor.commands.setSearchTerm('cat');
    // 不敏感：Cat / cat / concat 内的 cat 共 3 处
    expect(editor.storage.searchReplace.resultCount).toBe(3);

    // 敏感：cat 与 concat 内的 cat（Cat 不再匹配）
    editor.commands.setSearchOptions({caseSensitive: true});
    expect(editor.storage.searchReplace.resultCount).toBe(2);

    // 不敏感 + 全词：Cat / cat（concat 中的 cat 不是全词）
    editor.commands.setSearchOptions({caseSensitive: false, wholeWord: true});
    expect(editor.storage.searchReplace.resultCount).toBe(2);
    editor.destroy();
  });

  it('replaceNext 替换当前项', () => {
    const editor = createHeadlessEditor();
    editor.commands.setSearchTerm('hello');
    editor.commands.replaceNext('hi');
    expect(editor.getHTML()).toBe('<p>hi world, hello editor</p>');
    editor.destroy();
  });

  it('replaceAll 全部替换，一次 undo 全部回滚', () => {
    const editor = createHeadlessEditor();
    editor.commands.setSearchTerm('hello');
    editor.commands.replaceAll('hi');
    expect(editor.getHTML()).toBe('<p>hi world, hi editor</p>');

    editor.commands.undo();
    expect(editor.getHTML()).toBe('<p>hello world, hello editor</p>');
    editor.destroy();
  });

  it('替换文本包含搜索词时 replaceAll 不死循环', () => {
    const editor = createHeadlessEditor('<p>ab ab</p>');
    editor.commands.setSearchTerm('ab');
    editor.commands.replaceAll('aab');
    expect(editor.getHTML()).toBe('<p>aab aab</p>');
    editor.destroy();
  });

  it('替换后搜索词不再匹配时 activeIndex 回退', () => {
    const editor = createHeadlessEditor('<p>ab ba</p>');
    editor.commands.setSearchTerm('ab');
    editor.commands.replaceAll('ba');
    expect(getPluginState(editor).matches).toHaveLength(0);
    expect(getPluginState(editor).activeIndex).toBe(-1);
    editor.destroy();
  });

  it('编辑文档后 matches 实时重算', () => {
    const editor = createHeadlessEditor('<p>ab</p>');
    editor.commands.setSearchTerm('ab');
    expect(editor.storage.searchReplace.resultCount).toBe(1);

    editor.commands.insertContentAt(3, 'ab ');
    expect(editor.storage.searchReplace.resultCount).toBe(2);
    editor.destroy();
  });

  it('clearSearch 清空状态', () => {
    const editor = createHeadlessEditor();
    editor.commands.setSearchTerm('hello');
    editor.commands.clearSearch();
    const state = getPluginState(editor);
    expect(state.searchTerm).toBe('');
    expect(state.matches).toHaveLength(0);
    expect(state.activeIndex).toBe(-1);
    editor.destroy();
  });

  it('无匹配时 goToMatch / replace* 返回 false', () => {
    const editor = createHeadlessEditor();
    editor.commands.setSearchTerm('nothing');
    expect(editor.commands.goToMatch('next')).toBe(false);
    expect(editor.commands.replaceNext('x')).toBe(false);
    expect(editor.commands.replaceAll('x')).toBe(false);
    editor.destroy();
  });

  it('goToMatch 标记程序化选区，用户选区事务将其重置', () => {
    const editor = createHeadlessEditor();
    editor.commands.setSearchTerm('hello');
    editor.commands.goToMatch('next');
    // 跳转设置的选区是程序化的，TextBubbleMenu 据此不唤起
    expect(getPluginState(editor).programmaticSelection).toBe(true);

    // 用户拖选（selection-only 事务）后重置，气泡恢复响应
    editor.commands.setTextSelection({from: 1, to: 5});
    expect(getPluginState(editor).programmaticSelection).toBe(false);

    // 再次跳转恢复标记；用户打字（docChanged）同样重置
    editor.commands.goToMatch('next');
    expect(getPluginState(editor).programmaticSelection).toBe(true);
    editor.commands.insertContentAt(1, 'x');
    expect(getPluginState(editor).programmaticSelection).toBe(false);
    editor.destroy();
  });
});
