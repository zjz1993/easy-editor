import type {Editor} from '@tiptap/core';
import {beforeAll, describe, expect, it} from 'vitest';
import {initIntl} from '@textory/editor-common';
import type {SlashItem} from './types';
import {SlashCommandRegistry} from './SlashCommandRegistry';

const fakeEditor = {} as Editor;

function makeItem(overrides: Partial<SlashItem> & Pick<SlashItem, 'id'>): SlashItem {
  return {
    command: () => {},
    ...overrides,
  };
}

const items: SlashItem[] = [
  makeItem({id: 'quote', title: '引用', keywords: ['quote']}),
  makeItem({id: 'heading-1', titleKey: 'header.level', titleValues: {level: 1}, keywords: ['h1']}),
  makeItem({id: 'image', title: '插入图片', keywords: ['image']}),
];

describe('SlashCommandRegistry', () => {
  beforeAll(() => {
    initIntl();
  });

  it('空查询返回全部可见项', () => {
    const registry = new SlashCommandRegistry().registerMany(items);

    expect(registry.search('', {editor: fakeEditor})).toHaveLength(3);
  });

  it('visible 谓词返回 false 的项被过滤', () => {
    const registry = new SlashCommandRegistry().registerMany([
      ...items,
      makeItem({id: 'hidden', title: '隐藏项', visible: () => false}),
    ]);

    const result = registry.search('', {editor: fakeEditor});

    expect(result.map((item) => item.id)).not.toContain('hidden');
    expect(result).toHaveLength(3);
  });

  it('按字面标题包含匹配且大小写不敏感', () => {
    const registry = new SlashCommandRegistry().registerMany(items);

    const result = registry.search('插入', {editor: fakeEditor});

    expect(result.map((item) => item.id)).toEqual(['image']);
  });

  it('titleKey 经 intl 解析后参与匹配（header.level -> 标题1）', () => {
    const registry = new SlashCommandRegistry().registerMany(items);

    const result = registry.search('标题', {editor: fakeEditor});

    expect(result.map((item) => item.id)).toEqual(['heading-1']);
  });

  it('keywords 命中且大小写不敏感', () => {
    const registry = new SlashCommandRegistry().registerMany(items);

    expect(registry.search('H1', {editor: fakeEditor}).map((item) => item.id)).toEqual(['heading-1']);
    expect(registry.search('quote', {editor: fakeEditor}).map((item) => item.id)).toEqual(['quote']);
  });

  it('前缀命中排在包含命中之前', () => {
    const registry = new SlashCommandRegistry().registerMany([
      makeItem({id: 'contains', title: '块引用'}),
      makeItem({id: 'prefix', title: '引用'}),
    ]);

    const result = registry.search('引用', {editor: fakeEditor});

    expect(result.map((item) => item.id)).toEqual(['prefix', 'contains']);
  });

  it('无命中返回空数组', () => {
    const registry = new SlashCommandRegistry().registerMany(items);

    expect(registry.search('表格', {editor: fakeEditor})).toEqual([]);
  });
});
