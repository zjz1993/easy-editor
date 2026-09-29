import type {Editor} from '@tiptap/core';
import {IntlComponent} from '@textory/editor-common';

export interface SlashItem {
  id: string;
  /**
   * 展示标题的 intl key。设置后渲染与搜索时经 IntlComponent.get
   * 解析（配合 initIntl 的 zh_cn 词表），优先于字面 title
   */
  titleKey?: string;
  /** titleKey 的插值参数，如 {level: 1} */
  titleValues?: Record<string, string | number>;
  /** 字面展示标题，titleKey 未设置时使用 */
  title?: string;
  description?: string;
  /** 搜索关键词（英文/拼音别名），与标题一同参与匹配 */
  keywords?: string[];
  /** 返回 false 时该项在当前编辑器状态下隐藏 */
  visible?: (context: {
    editor: Editor;
  }) => boolean;
  command: ({editor, range}: {
    editor: Editor;
    range: {from: number; to: number};
  }) => void;
}

/**
 * 解析菜单项展示标题：优先 intl key，否则字面 title。
 * 渲染与搜索统一走这里，保证两边匹配的是同一份文案
 */
export function resolveSlashItemTitle(
  item: Pick<SlashItem, 'title' | 'titleKey' | 'titleValues'>,
): string {
  if (item.titleKey) {
    return IntlComponent.get(item.titleKey, item.titleValues);
  }

  return item.title ?? '';
}
