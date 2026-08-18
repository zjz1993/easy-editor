import {
  Extension,
  type JSONContent,
  type MarkdownParseHelpers,
  type MarkdownToken,
} from '@tiptap/core';
import {BLOCK_TYPES} from '@textory/editor-utils/constants';

/**
 * 列表 token 的自定义解析器。
 *
 * 背景：@tiptap/markdown 的内置列表处理器硬编码输出 `bulletList` / `listItem` /
 * `taskList` / `taskItem` 等默认节点名，而本编辑器的 schema 是
 * `unorderedList` / `list_item` / `checkList` / `checkListItem`（自研命名），
 * 且自研 checkList 不携带官方 parseMarkdown 处理器，任务列表的勾选语义
 * 会在解析层丢失（见 .ai/specs/2026-08-18-markdown-paste-input/spec.md §4）。
 *
 * 因此这里以高优先级注册一个 `list` token 处理器，直接产出本编辑器节点名：
 * - 无序 + 任务列表：自行解析（unorderedList / checkList）
 * - 有序列表：返回 [] 交还官方 orderedList 处理器（attrs 逻辑更完整），
 *   其产物中的 `listItem` 由 mapParsedMarkdown 统一改名
 */

/** 判断一个 list_item token 是否为任务列表项（gfm 下 marked 会打 task 标记） */
export function isTaskListItem(item: MarkdownToken): boolean {
  if (item.task === true) {
    return true;
  }
  return /^\s*[-+*]\s+\[[ xX]\]/.test(String(item.raw ?? ''));
}

/** 把 items 按任务/非任务切成连续段，保持原顺序 */
export function splitListRuns(
  items: MarkdownToken[],
): Array<{isTask: boolean; items: MarkdownToken[]}> {
  const runs: Array<{isTask: boolean; items: MarkdownToken[]}> = [];
  for (const item of items) {
    const isTask = isTaskListItem(item);
    const last = runs[runs.length - 1];
    if (last && last.isTask === isTask) {
      last.items.push(item);
    } else {
      runs.push({isTask, items: [item]});
    }
  }
  return runs;
}

/** 把行内 text token 解析为 paragraph 的行内内容 */
function parseTextTokenInline(
  token: MarkdownToken,
  h: MarkdownParseHelpers,
): JSONContent[] | null {
  if (Array.isArray(token.tokens) && token.tokens.length > 0) {
    return h.parseInline(token.tokens);
  }
  // 紧凑列表的纯文本项可能不带内联 tokens，按原文兜底
  const raw = String(token.text ?? token.raw ?? '');
  if (!raw) {
    return null;
  }
  if (h.tokenizeInline) {
    const tokens = h.tokenizeInline(raw);
    if (tokens.length > 0) {
      return h.parseInline(tokens);
    }
  }
  return [h.createTextNode(raw)];
}

/** 构建 list_item / checkListItem 的 content（首段 paragraph + 其余块级子节点） */
export function buildListItemContent(
  item: MarkdownToken,
  h: MarkdownParseHelpers,
): JSONContent[] {
  const content: JSONContent[] = [];
  // 任务项的 tokens[0] 是 checkbox 标记 token（'[ ] '），勾选状态已体现在
  // checkListItem attrs 上，这里直接跳过
  const tokens: MarkdownToken[] = (Array.isArray(item.tokens) ? item.tokens : []).filter(
    t => t.type !== 'checkbox',
  );
  const parseBlocks = h.parseBlockChildren ?? h.parseChildren;

  if (tokens.length > 0) {
    const first = tokens[0];
    const rest = tokens.slice(1);
    if (first.type === 'text') {
      const inline = parseTextTokenInline(first, h);
      if (inline) {
        content.push(h.createNode('paragraph', {}, inline));
        if (rest.length > 0) {
          content.push(...parseBlocks(rest));
        }
      } else {
        content.push(...parseBlocks(tokens));
      }
    } else {
      content.push(...parseBlocks(tokens));
    }
  } else if (item.text) {
    content.push(h.createNode('paragraph', {}, [h.createTextNode(item.text)]));
  }
  if (content.length === 0) {
    // schema 要求列表项以 paragraph 开头
    content.push(h.createNode('paragraph', {}, []));
  }

  // 官方自定义 tokenizer 产出的嵌套内容挂在 nestedTokens 上
  if (Array.isArray((item as any).nestedTokens) && (item as any).nestedTokens.length > 0) {
    content.push(...h.parseChildren((item as any).nestedTokens));
  }
  return content;
}

/** 单个任务列表项 → checkListItem */
function buildCheckListItem(
  item: MarkdownToken,
  h: MarkdownParseHelpers,
): JSONContent {
  return h.createNode(
    BLOCK_TYPES.CLI,
    {checked: item.checked === true},
    buildListItemContent(item, h),
  );
}

/** 单个无序列表项 → list_item */
function buildListItem(item: MarkdownToken, h: MarkdownParseHelpers): JSONContent {
  return h.createNode(BLOCK_TYPES.LI, {}, buildListItemContent(item, h));
}

/**
 * `list` token 解析入口：
 * - 有序列表返回 []（交还官方 orderedList 处理器）
 * - 纯无序列表且不含任务项返回 []（交还官方 bulletList 处理器，
 *   产物由 mapParsedMarkdown 改名为 unorderedList）
 * - 含任务项时按连续段自行构建：任务段 → checkList，无序段 → unorderedList
 */
export function parseListToken(
  token: MarkdownToken,
  h: MarkdownParseHelpers,
): JSONContent[] {
  if (token.type !== 'list' || token.ordered || !Array.isArray(token.items)) {
    return [];
  }
  const runs = splitListRuns(token.items);
  if (runs.length === 1 && !runs[0].isTask) {
    // 纯无序列表走官方处理器 + JSON 后处理改名，避免重复实现嵌套细节
    return [];
  }
  return runs.map(run =>
    run.isTask
      ? h.createNode(
          BLOCK_TYPES.CL,
          {},
          run.items.map(item => buildCheckListItem(item, h)),
        )
      : h.createNode(
          BLOCK_TYPES.UL,
          {},
          run.items.map(item => buildListItem(item, h)),
        ),
  );
}

/**
 * 挂载到编辑器的高优先级 `list` token 处理器。
 * priority 需高于官方列表扩展（默认 100），保证注册在它们之前被优先尝试；
 * 返回 [] 时自动落回官方处理器。
 */
export const MarkdownListHandler = Extension.create({
  name: 'markdownListHandler',
  priority: 1000,
  markdownTokenName: 'list',
  parseMarkdown: (token, helpers) => parseListToken(token, helpers),
});
