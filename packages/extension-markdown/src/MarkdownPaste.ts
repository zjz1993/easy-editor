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
 * 判断 html 剪贴板内容是否只是 markdown 原文的"裸包装"：
 * 主体为单个/多个 `<pre>`（如聊天窗口代码块、IDE 复制的 html flavor），
 * pre 之外没有任何富文本块级结构（标题/列表/引用/表格）与实质文本。
 * 这类剪贴板没有可保留的富文本格式，应按 plain 文本的 markdown 解析处理。
 */
export function isRawSourceHtml(html: string): boolean {
  if (!/<pre[\s>]/i.test(html)) {
    return false;
  }
  let remainder = html.replace(/<pre[\s\S]*?<\/pre>/gi, '');
  // VSCode/JetBrains 等来源会附带内联样式块与文件标题，属于包装噪音
  // 而非富文本内容（title 的文本内容若不剥离会导致误判为富文本）
  remainder = remainder.replace(/<(style|script|title)[\s\S]*?<\/\1>/gi, '');
  if (/<(h[1-6]|ul|ol|blockquote|table|p|img|iframe)\b/i.test(remainder)) {
    return false;
  }
  // JetBrains 系剪贴板会在 html 末尾追加 NUL 字符，trim() 不视其为空白，
  // 需连同控制字符一并剔除后再做空文本判定
  const textOnly = remainder
    .replace(/<[^>]+>/g, '')
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, '');
  return textOnly.trim().length === 0;
}

/** VSCode 元数据（vscode-editor-data）的 mode 是否为 markdown 文件 */
export function isVscodeMarkdownSource(vscodeData: string): boolean {
  try {
    const mode = JSON.parse(vscodeData)?.mode;
    return typeof mode === 'string' && /^(markdown|md)$/i.test(mode);
  } catch {
    return false;
  }
}

/**
 * VSCode 元数据是否表示"代码复制"（应让位给 code-block 处理器）：
 * mode 为明确的非 markdown 语言时才让位；mode 缺失（部分 IDE 分支
 * 不写 mode）不视为代码复制信号，交由 html/纯文本路径决策。
 */
export function isVscodeCodeCopy(vscodeData: string): boolean {
  try {
    const mode = JSON.parse(vscodeData)?.mode;
    if (typeof mode !== 'string' || mode.length === 0) {
      return false;
    }
    return !/^(markdown|md)$/i.test(mode);
  } catch {
    return false;
  }
}

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
            // 富文本剪贴板（网页/Word/渲染后的内容）走默认 HTML 粘贴路径。
            // 例外：html 只是 markdown 原文的 <pre> 裸包装（聊天窗口代码块、
            // IDE 复制等）时没有可保留的格式，继续按 markdown 解析
            const html = clipboard.getData('text/html');
            console.log({html});
            if (html && !isRawSourceHtml(html)) {
              return false;
            }
            // VSCode 源码复制让位给 code-block 处理器；但复制 .md 文件
            // （mode=markdown）或元数据无 mode 时不应据此让位
            const vscode = clipboard.getData('vscode-editor-data');
            if (vscode && isVscodeCodeCopy(vscode)) {
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
