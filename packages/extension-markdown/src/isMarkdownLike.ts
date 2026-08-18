/**
 * Markdown 特征检测（严格启发式）。
 *
 * 仅当文本命中至少一条特征规则时才认为"像 Markdown"，未命中的纯文本
 * 保持原样粘贴。规则分块级（行首）与行内两类，任一命中即返回 true。
 *
 * 详见 .ai/specs/2026-08-18-markdown-paste-input/spec.md §4。
 */

/** 超过该长度直接判否，避免极端大粘贴的检测/解析开销 */
export const DEFAULT_MAX_CHECK_LENGTH = 100_000;

/** 行首块级语法：标题 / 无序有序列表 / 任务列表 / 引用 / 围栏 / 分割线 / 表格行 */
const BLOCK_LINE_RULES: RegExp[] = [
  /^#{1,6}\s+\S/m, // ATX 标题
  /^\s{0,3}(?:[-*+]|\d{1,9}[.)])\s+\S/m, // 无序 / 有序列表标记
  /^\s{0,3}(?:[-*+])\s+\[[ xX]\]/m, // 任务列表标记
  /^\s{0,3}>\s?\S/m, // 引用
  /^\s*```/m, // 围栏代码块
  /^\s{0,3}(?:-{3,}|\*{3,}|_{3,})\s*$/m, // 分割线
  /^\s*\|.+\|\s*$/m, // GFM 表格行
];

/** 行内语法：加粗 / 斜体 / 删除线 / 高亮 / 行内代码 / 链接 / 图片 */
const INLINE_RULES: RegExp[] = [
  /\*\*[^*\n]+\*\*/, // **bold**
  /__[^_\n]+__/, // __bold__
  /(?<!\*)\*[^*\s][^*\n]*\*(?!\*)/, // *italic*（内容不以空白开头，降低误判）
  /~~[^~\n]+~~/, // ~~strike~~
  /==[^=\n]+==/, // ==highlight==
  /`[^`\n]+`/, // `code`
  /!?\[[^\]\n]*\]\([^)\n]+\)/, // [text](url) 与 ![alt](url)
];

/**
 * 判断纯文本是否命中 Markdown 特征。
 *
 * @param text 剪贴板纯文本
 * @param maxCheckLength 超过该长度直接返回 false，默认 100_000
 */
export function isMarkdownLike(
  text: string,
  maxCheckLength: number = DEFAULT_MAX_CHECK_LENGTH,
): boolean {
  if (!text || text.length > maxCheckLength) {
    return false;
  }
  return (
    BLOCK_LINE_RULES.some(rule => rule.test(text)) ||
    INLINE_RULES.some(rule => rule.test(text))
  );
}
