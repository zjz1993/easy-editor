import type {JSONContent} from '@tiptap/core';
import {BLOCK_TYPES} from '@textory/editor-utils/constants';

/**
 * @tiptap/markdown 解析产物 → 本编辑器 schema 的 JSON 后处理：
 *
 * 1. 节点改名：官方处理器硬编码的默认节点名映射到本编辑器自研命名
 *    （horizontalRule → divider 等；bulletList/listItem 主要来自
 *    官方列表处理器的兜底路径，见 listParser.ts）
 * 2. 安全过滤：link mark 的 href、image 节点的 src 仅允许 http(s)，
 *    其余（javascript:、data:、相对路径等）直接剥离——与 CustomLink
 *    输入校验（/^https?:\/\//）保持一致的策略
 */

const NODE_RENAMES: Record<string, string> = {
  bulletList: BLOCK_TYPES.UL,
  listItem: BLOCK_TYPES.LI,
  taskList: BLOCK_TYPES.CL,
  taskItem: BLOCK_TYPES.CLI,
  horizontalRule: BLOCK_TYPES.HR,
};

/** 内容被过滤清空后可安全丢弃的容器节点（删除后不破坏兄弟结构） */
const DROPPABLE_WHEN_EMPTY = new Set<string>([
  BLOCK_TYPES.P,
  BLOCK_TYPES.UL,
  BLOCK_TYPES.OL,
  BLOCK_TYPES.CL,
]);

const SAFE_URL = /^https?:\/\//i;

export function isSafeUrl(url: unknown): boolean {
  return typeof url === 'string' && SAFE_URL.test(url);
}

function compact(nodes: Array<JSONContent | null>): JSONContent[] {
  return nodes.filter((n): n is JSONContent => n !== null);
}

/**
 * 递归映射单个节点（或节点数组）。
 * 返回 null 表示该节点应被丢弃（如非法 scheme 的图片）。
 */
export function mapParsedMarkdown(input: JSONContent): JSONContent | null {
  if (Array.isArray(input)) {
    const mapped = compact(input.map(node => mapParsedMarkdown(node)));
    return mapped as unknown as JSONContent;
  }
  if (!input || typeof input !== 'object' || typeof input.type !== 'string') {
    return input;
  }

  // 图片外链仅允许 http(s)，其余丢弃（spec §8-Q3 决策）
  if (input.type === BLOCK_TYPES.IMG && !isSafeUrl(input.attrs?.src)) {
    return null;
  }

  const mapped: JSONContent = {...input, type: NODE_RENAMES[input.type] ?? input.type};

  if (Array.isArray(input.marks)) {
    const marks = input.marks.filter(
      mark => !(mark.type === 'link' && !isSafeUrl(mark.attrs?.href)),
    );
    if (marks.length > 0) {
      mapped.marks = marks;
    } else {
      delete mapped.marks;
    }
  }

  if (Array.isArray(input.content)) {
    mapped.content = compact(input.content.map(child => mapParsedMarkdown(child)));
    if (
      mapped.content.length === 0 &&
      input.content.length > 0 &&
      DROPPABLE_WHEN_EMPTY.has(input.type)
    ) {
      // 段落/列表内容被安全过滤清空（如仅含非法图片）→ 整体丢弃
      return null;
    }
  }

  return mapped;
}
