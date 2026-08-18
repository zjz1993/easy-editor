import {Extension, InputRule} from '@tiptap/core';
import {Plugin, PluginKey} from '@tiptap/pm/state';
import type {JSONContent} from '@tiptap/core';
import {BLOCK_TYPES, MARK_TYPES} from '@textory/editor-utils/constants';
import {DEFAULT_MAX_CHECK_LENGTH, isMarkdownLike} from './isMarkdownLike';
import {mapParsedMarkdown} from './mapParsedMarkdown';
import type {MarkdownManager} from '@tiptap/markdown';

export interface MarkdownPasteOptions {
  /** 超过该长度的纯文本不做 Markdown 检测，直接走默认粘贴 */
  maxCheckLength: number;
}

/** MarkdownManager 形状（避免耦合 @tiptap/markdown 的完整类型） */
type MarkdownParseCapable = Pick<MarkdownManager, 'parse'>;

/** 行内链接输入语法：`[text](url)` + 空格 触发（spec §4 输入规则补齐项） */
export const LINK_INPUT_REGEX = /(?:^|\s)(\[[^\]\n]+\]\(https?:\/\/[^\s)]+\))\s$/;

/**
 * 粘贴转换管线（纯函数，便于单测）：
 * 检测 → 解析 → schema 映射。任何一步不满足都返回 null，走默认粘贴。
 */
export function convertMarkdownToContent(
  manager: MarkdownParseCapable | undefined,
  text: string,
  maxCheckLength: number = DEFAULT_MAX_CHECK_LENGTH,
): JSONContent[] | null {
  if (!manager || !text || text.length > maxCheckLength) {
    return null;
  }
  if (!isMarkdownLike(text, maxCheckLength)) {
    return null;
  }
  let parsed: JSONContent;
  try {
    parsed = manager.parse(text);
  } catch {
    return null;
  }
  const mapped = mapParsedMarkdown(parsed);
  const content = Array.isArray(mapped?.content) ? mapped.content : [];
  return content.length > 0 ? content : null;
}

/**
 * Markdown 粘贴支持扩展。
 *
 * 仅当剪贴板为纯文本（无 text/html）且命中 Markdown 特征时接管粘贴：
 * editor.markdown.parse → mapParsedMarkdown → insertContent（单事务，
 * 一次 Ctrl+Z 可整体撤销）。
 *
 * priority 必须高于 CodeBlock（默认 100）：CodeBlock 的 handlePaste 会对
 * 任意"多行且 detectLanguage 判定出语言"的纯文本创建代码块，Markdown 文本
 * 几乎必然命中，若 CodeBlock 在前则本扩展永远不生效。让位规则：
 * 剪贴板含 vscode-editor-data（VSCode 源码复制）或 text/html 时直接放行。
 */
export const MarkdownPaste = Extension.create<MarkdownPasteOptions>({
  name: 'markdownPaste',
  priority: 200,
  addOptions() {
    return {
      maxCheckLength: DEFAULT_MAX_CHECK_LENGTH,
    };
  },
  addInputRules() {
    const editor = this.editor;
    return [
      new InputRule({
        find: LINK_INPUT_REGEX,
        handler: ({state, range, match}) => {
          const linkType = editor.schema.marks[MARK_TYPES.LK];
          if (!linkType) {
            return null;
          }
          const parsed = /^\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)$/.exec(
            match[1] ?? '',
          );
          if (!parsed) {
            return null;
          }
          const [, text, href] = parsed;
          const startSpaces = match[0].search(/\S/);
          const syntaxStart = range.from + startSpaces;
          const tr = state.tr;
          tr.delete(syntaxStart, range.to);
          tr.insertText(text, syntaxStart);
          tr.addMark(syntaxStart, syntaxStart + text.length, linkType.create({href}));
        },
      }),
    ];
  },
  addProseMirrorPlugins() {
    const editor = this.editor;
    const {maxCheckLength} = this.options;
    return [
      new Plugin({
        key: new PluginKey('markdownPaste'),
        props: {
          handlePaste: (view, event) => {
            if (!editor.isEditable) {
              return false;
            }
            const clipboard = event.clipboardData;
            if (!clipboard) {
              return false;
            }
            // 富文本剪贴板（网页/Word/VSCode 带样式）走默认 HTML 粘贴路径
            //if (clipboard.getData('text/html')) {
            //  return false;
            //}
            // VSCode 源码复制（含编辑器元数据，可能无 html）让位给
            // code-block 的 VSCode 处理器
            if (clipboard.getData('vscode-editor-data')) {
              return false;
            }
            const text = clipboard.getData('text/plain');
            // 代码块内粘贴保持纯文本原文
            const {$from} = view.state.selection;
            for (let depth = $from.depth; depth > 0; depth -= 1) {
              if ($from.node(depth).type.name === BLOCK_TYPES.CODE) {
                return false;
              }
            }
            const content = convertMarkdownToContent(
              editor.markdown,
              text,
              maxCheckLength,
            );
            if (!content) {
              return false;
            }
            // schema 缺任一目标节点时 insertContent 会整包静默丢弃且仍返回
            // true（如宿主未挂载列表扩展），用文档结构对比兜底回退默认粘贴。
            // 注意用 eq（结构相等）而非引用对比——空事务也会替换 doc 实例
            const docBefore = view.state.doc;
            let inserted = false;
            try {
              inserted = editor.commands.insertContent(content);
            } catch {
              inserted = false;
            }
            return inserted && !view.state.doc.eq(docBefore);
          },
        },
      }),
    ];
  },
});
