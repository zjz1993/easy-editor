import type {Editor} from '@tiptap/core';
import type {SlashItem} from './types';
import {resolveSlashItemTitle} from './types';

/** 匹配档位：前缀命中 0，包含命中 1，未命中 -1 */
type MatchRank = -1 | 0 | 1;

function matchRank(item: SlashItem, keyword: string): MatchRank {
  const title = resolveSlashItemTitle(item).toLowerCase();
  const keywords = item.keywords?.map((word) => word.toLowerCase()) ?? [];

  if (
    title.startsWith(keyword) ||
    keywords.some((word) => word.startsWith(keyword))
  ) {
    return 0;
  }

  if (
    title.includes(keyword) ||
    keywords.some((word) => word.includes(keyword))
  ) {
    return 1;
  }

  return -1;
}

export class SlashCommandRegistry {
  private items: SlashItem[] = [];

  register(item: SlashItem) {
    this.items.push(item);

    return this;
  }

  registerMany(items: SlashItem[]) {
    this.items.push(...items);

    return this;
  }

  getAll(context: {editor: Editor}) {
    return this.items.filter((item) => {
      return item.visible?.(context) ?? true;
    });
  }

  search(query: string, context: {editor: Editor}) {
    const items = this.getAll(context);
    const keyword = query.trim().toLowerCase();

    if (!keyword) {
      return items;
    }

    return items
      .map((item) => ({item, rank: matchRank(item, keyword)}))
      .filter(({rank}) => rank >= 0)
      .sort((a, b) => a.rank - b.rank)
      .map(({item}) => item);
  }
}
