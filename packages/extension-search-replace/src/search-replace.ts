import {Extension} from '@tiptap/core';
import {Plugin, PluginKey, TextSelection} from '@tiptap/pm/state';
import type {EditorState, Transaction} from '@tiptap/pm/state';
import {Decoration, DecorationSet} from '@tiptap/pm/view';
import type {Node as PMNode} from '@tiptap/pm/model';

export interface SearchMatchRange {
  from: number;
  to: number;
}

export interface SearchReplacePluginState {
  searchTerm: string;
  caseSensitive: boolean;
  wholeWord: boolean;
  matches: SearchMatchRange[];
  activeIndex: number;
  /** 高亮 decorations 与 matches 同步重建 */
  decorations: DecorationSet;
  /**
   * 选区是否由 goToMatch/replaceNext 程序化设置。
   * 用于让 TextBubbleMenu 等选区驱动的浮层区分「搜索跳转」与「用户选择」；
   * 任何用户交互产生的 selection/doc 事务都会将其重置为 false。
   */
  programmaticSelection: boolean;
}

export interface SearchReplaceStorage {
  resultCount: number;
  activeIndex: number;
  programmaticSelection: boolean;
}

export interface SearchReplaceOptions {
  /** 初始大小写敏感开关，默认 false */
  caseSensitive?: boolean;
  /** 初始全词匹配开关，默认 false */
  wholeWord?: boolean;
}

export const SEARCH_REPLACE_CLASS = 'textory-search-match';
export const SEARCH_REPLACE_ACTIVE_CLASS = 'textory-search-match--active';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    searchReplace: {
      /** 设置搜索词；空字符串清除高亮 */
      setSearchTerm: (term: string) => ReturnType;
      /** 更新大小写敏感 / 全词匹配开关 */
      setSearchOptions: (options: {caseSensitive?: boolean; wholeWord?: boolean}) => ReturnType;
      /** 跳转到上/下一个匹配（循环），激活项滚动到可视区 */
      goToMatch: (direction: 'next' | 'prev') => ReturnType;
      /** 替换当前激活项并跳到下一处 */
      replaceNext: (replace: string) => ReturnType;
      /** 全部替换（单个 transaction，一次 undo 全部回滚） */
      replaceAll: (replace: string) => ReturnType;
      /** 清除搜索词与高亮 */
      clearSearch: () => ReturnType;
    };
  }

  interface Storage {
    searchReplace: SearchReplaceStorage;
  }
}

export const searchReplacePluginKey = new PluginKey<SearchReplacePluginState>('searchReplace');

export function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * 构建 matcher 正则。搜索词按字面量转义（第一版不支持正则语法）；
 * wholeWord 时加 \b 边界（对 CJK 无效果但无害）。
 */
export function buildSearchRegex(
  term: string,
  options: {caseSensitive: boolean; wholeWord: boolean},
): RegExp | null {
  if (!term) return null;
  const escaped = escapeRegExp(term);
  const source = options.wholeWord ? `\\b(?:${escaped})\\b` : escaped;
  return new RegExp(source, options.caseSensitive ? 'g' : 'gi');
}

/**
 * 遍历 doc 的 text node 收集匹配区间。
 * 匹配不跨 text node（即不跨 mark / 节点边界），与 tiptap pro 行为一致。
 * 用 exec 循环而非 String.matchAll，规避 ES2020 API（构建 target 为 ES2018）。
 */
export function findMatches(
  doc: PMNode,
  term: string,
  options: {caseSensitive: boolean; wholeWord: boolean},
): SearchMatchRange[] {
  const regex = buildSearchRegex(term, options);
  if (!regex) return [];

  const matches: SearchMatchRange[] = [];
  doc.descendants((node, pos) => {
    if (!node.isText || !node.text) return;
    const text = node.text;
    regex.lastIndex = 0;
    let result = regex.exec(text);
    while (result !== null) {
      matches.push({from: pos + result.index, to: pos + result.index + result[0].length});
      result = regex.exec(text);
    }
  });
  return matches;
}

function buildDecorations(
  doc: PMNode,
  matches: SearchMatchRange[],
  activeIndex: number,
): DecorationSet {
  return DecorationSet.create(
    doc,
    matches.map((match, index) =>
      Decoration.inline(match.from, match.to, {
        class:
          index === activeIndex
            ? `${SEARCH_REPLACE_CLASS} ${SEARCH_REPLACE_ACTIVE_CLASS}`
            : SEARCH_REPLACE_CLASS,
      }),
    ),
  );
}

function computePluginState(
  doc: PMNode,
  prev: SearchReplacePluginState,
  overrides: Partial<SearchReplacePluginState>,
  recompute: boolean,
): SearchReplacePluginState {
  const next: SearchReplacePluginState = {...prev, ...overrides};
  if (recompute) {
    next.matches = findMatches(doc, next.searchTerm, {
      caseSensitive: next.caseSensitive,
      wholeWord: next.wholeWord,
    });
  }
  if (next.activeIndex >= next.matches.length) {
    next.activeIndex = next.matches.length > 0 ? next.matches.length - 1 : -1;
  }
  next.decorations = buildDecorations(doc, next.matches, next.activeIndex);
  return next;
}

interface SearchMeta {
  searchTerm?: string;
  caseSensitive?: boolean;
  wholeWord?: boolean;
  activeIndex?: number;
  /** goToMatch/replaceNext 设置：选区由命令程序化创建 */
  programmaticSelection?: boolean;
}

function createSearchReplacePlugin(initialOptions: SearchReplaceOptions) {
  return new Plugin<SearchReplacePluginState>({
    key: searchReplacePluginKey,

    state: {
      init(): SearchReplacePluginState {
        return {
          searchTerm: '',
          caseSensitive: initialOptions.caseSensitive ?? false,
          wholeWord: initialOptions.wholeWord ?? false,
          matches: [],
          activeIndex: -1,
          decorations: DecorationSet.empty,
          programmaticSelection: false,
        };
      },
      apply(tr, prev): SearchReplacePluginState {
        const meta = tr.getMeta(searchReplacePluginKey) as SearchMeta | undefined;
        if (meta || tr.docChanged) {
          // 重算条件：doc 变化（matches 位置全部失效），或搜索条件变化
          const optionsChanged =
            meta?.searchTerm !== undefined ||
            meta?.caseSensitive !== undefined ||
            meta?.wholeWord !== undefined;
          const overrides: Partial<SearchReplacePluginState> = {...meta};
          const next = computePluginState(tr.doc, prev, overrides, tr.docChanged || optionsChanged);
          // 仅 goToMatch/replaceNext 显式标记为程序化选区；
          // 普通编辑事务（含 docChanged 的用户输入）一律视为用户行为
          next.programmaticSelection = meta?.programmaticSelection === true;
          return next;
        }
        // selection-only 事务（用户点击/拖选产生）重置程序化选区标记，
        // 让 TextBubbleMenu 恢复对后续真实选择的响应
        if (tr.selectionSet && prev.programmaticSelection) {
          return {...prev, programmaticSelection: false};
        }
        return prev;
      },
    },

    props: {
      decorations(state: EditorState) {
        return searchReplacePluginKey.getState(state)?.decorations;
      },
    },
  });
}

/**
 * 从 doc 中删除所有匹配并替换。倒序 insertText 保证位置不失效；
 * 同一 transaction 内合并，一次 undo 全部回滚。
 */
function applyReplaceAll(tr: Transaction, matches: SearchMatchRange[], replace: string) {
  for (let i = matches.length - 1; i >= 0; i--) {
    tr.insertText(replace, matches[i].from, matches[i].to);
  }
}

export const SearchReplace = Extension.create<SearchReplaceOptions, SearchReplaceStorage>({
  name: 'searchReplace',

  addOptions() {
    return {
      caseSensitive: false,
      wholeWord: false,
    };
  },

  addStorage() {
    return {
      resultCount: 0,
      activeIndex: -1,
      programmaticSelection: false,
    };
  },

  addProseMirrorPlugins() {
    return [createSearchReplacePlugin(this.options)];
  },

  // doc/plugin state 变化后同步到 storage，供 React 面板读取
  onTransaction({editor}) {
    const pluginState = searchReplacePluginKey.getState(editor.state);
    if (!pluginState) return;
    this.storage.resultCount = pluginState.matches.length;
    this.storage.activeIndex = pluginState.activeIndex;
    this.storage.programmaticSelection = pluginState.programmaticSelection;
  },

  addCommands() {
    const getPluginState = (state: EditorState) => searchReplacePluginKey.getState(state);

    return {
      setSearchTerm:
        (term: string) =>
        ({state, dispatch, tr}) => {
          if (dispatch) {
            tr.setMeta(searchReplacePluginKey, {searchTerm: term, activeIndex: term ? 0 : -1});
            dispatch(tr);
          }
          return true;
        },

      setSearchOptions:
        (options: {caseSensitive?: boolean; wholeWord?: boolean}) =>
        ({state, dispatch, tr}) => {
          if (dispatch) {
            tr.setMeta(searchReplacePluginKey, options);
            dispatch(tr);
          }
          return true;
        },

      goToMatch:
        (direction: 'next' | 'prev') =>
        ({state, dispatch, tr}) => {
          const pluginState = getPluginState(state);
          if (!pluginState || pluginState.matches.length === 0) return false;

          const total = pluginState.matches.length;
          const current = pluginState.activeIndex;
          const nextIndex =
            direction === 'next'
              ? current + 1 >= total
                ? 0
                : current + 1
              : current - 1 < 0
                ? total - 1
                : current - 1;

          const match = pluginState.matches[nextIndex];
          tr.setMeta(searchReplacePluginKey, {
            activeIndex: nextIndex,
            programmaticSelection: true,
          });
          tr.setSelection(TextSelection.create(tr.doc, match.from, match.to));
          tr.scrollIntoView();
          dispatch?.(tr);
          return true;
        },

      replaceNext:
        (replace: string) =>
        ({state, dispatch, tr}) => {
          const pluginState = getPluginState(state);
          if (!pluginState || pluginState.matches.length === 0) return false;

          const index = Math.max(pluginState.activeIndex, 0);
          const match = pluginState.matches[index];
          if (!match) return false;

          tr.insertText(replace, match.from, match.to);
          tr.setMeta(searchReplacePluginKey, {activeIndex: index});
          dispatch?.(tr);
          return true;
        },

      replaceAll:
        (replace: string) =>
        ({state, dispatch, tr}) => {
          const pluginState = getPluginState(state);
          if (!pluginState || pluginState.matches.length === 0) return false;

          applyReplaceAll(tr, pluginState.matches, replace);
          tr.setMeta(searchReplacePluginKey, {activeIndex: -1});
          dispatch?.(tr);
          return true;
        },

      clearSearch:
        () =>
        ({dispatch, tr}) => {
          if (dispatch) {
            tr.setMeta(searchReplacePluginKey, {searchTerm: '', activeIndex: -1});
            dispatch(tr);
          }
          return true;
        },
    };
  },
});
