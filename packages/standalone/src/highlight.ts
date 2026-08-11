/**
 * Standalone syntax highlight bundle.
 *
 * 用于把编辑器产出的 HTML（`<pre><code class="language-xxx">`）在渲染侧
 * 重新应用语法高亮——Tiptap 内部高亮走 ProseMirror decoration（运行时注入），
 * `editor.getHTML()` 不会持久化高亮 spans，渲染侧需要重新跑一次 lowlight。
 *
 * 与编辑器内部使用的 lowlight 实例完全相同（同一包、同一语言注册集），
 * 高亮解析结果一致；配色复用 `highlight-theme.css`（与编辑器 `codeBlockNodeView.scss`
 * 中 hljs 部分一致）。
 *
 * 用法：
 * ```html
 * <script src="textory.highlight.min.js"></script>
 * <script>
 *   TextoryHighlight.highlightAll();
 *   // 或限定根节点：TextoryHighlight.highlightAll(document.querySelector('.post-content'));
 * </script>
 * ```
 *
 * 不依赖 React/Tiptap，仅依赖 lowlight（已内联）。
 */
import {lowlight} from 'lowlight';

// ────────────── 类型 ──────────────
interface HastNode {
  type: 'root' | 'element' | 'text';
  tagName?: string;
  value?: string;
  properties?: {className?: string[]; [k: string]: unknown};
  children?: HastNode[];
}

// ────────────── alias 映射 ──────────────
// lowlight.listLanguages() 仅返回主语言名（不含 alias），
// 编辑器的 languages.ts 维护了一份 alias 表（js/tsx/html/svg/yml 等），
// 这里复制一份以保证 `<code class="language-js">` 也能识别为 javascript。
const ALIAS_TO_MAIN: Record<string, string> = {
  // javascript
  js: 'javascript',
  jsx: 'javascript',
  mjs: 'javascript',
  cjs: 'javascript',
  // typescript
  ts: 'typescript',
  tsx: 'typescript',
  // xml (html 系列)
  html: 'xml',
  xhtml: 'xml',
  rss: 'xml',
  atom: 'xml',
  xjb: 'xml',
  xsd: 'xml',
  xsl: 'xml',
  plist: 'xml',
  wsf: 'xml',
  svg: 'xml',
  // yaml
  yml: 'yaml',
  // plaintext
  text: 'plaintext',
  txt: 'plaintext',
  // java
  jsp: 'java',
};

const REGISTERED = new Set(lowlight.listLanguages());

function resolveLanguage(classAttr: string | undefined): string | undefined {
  if (!classAttr) return undefined;
  const m = /\blanguage-([\w-]+)\b/.exec(classAttr) || /\blang-([\w-]+)\b/.exec(classAttr);
  if (!m) return undefined;
  const raw = m[1].toLowerCase();
  if (REGISTERED.has(raw)) return raw;
  const main = ALIAS_TO_MAIN[raw];
  if (main && REGISTERED.has(main)) return main;
  return undefined;
}

// ────────────── hast → HTML 序列化 ──────────────
// lowlight.highlight() 返回 hast Root。不引入 hast-util-to-html 是为了
// 保持 bundle 体积小（<5KB 增量）。lowlight 输出的 hast 仅含 span + text，
// 自写一个简单序列化器即可。
function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function serializeHast(node: HastNode): string {
  if (node.type === 'text') {
    return escapeHtml(node.value || '');
  }
  if (node.type === 'element') {
    const tag = node.tagName || 'span';
    const classes = node.properties?.className;
    const attrs = classes?.length ? ` class="${classes.join(' ')}"` : '';
    const inner = (node.children || []).map(serializeHast).join('');
    return `<${tag}${attrs}>${inner}</${tag}>`;
  }
  if (node.type === 'root') {
    return (node.children || []).map(serializeHast).join('');
  }
  return '';
}

// ────────────── 公开 API ──────────────

/**
 * 高亮单个 `<code>` 元素。
 *
 * 行为：
 * - 读取 `class="language-xxx"` 推断语言；缺失时 fallback 到 `highlightAuto`
 * - 跑 lowlight.highlight / highlightAuto，把返回的 hast 树序列化为 HTML
 * - 替换元素的 innerHTML
 * - 加 `hljs` class（与 hljs 主题 CSS 协作）
 * - 标记 `data-textory-highlighted="1"` 防止重复处理
 */
export function highlightElement(el: HTMLElement): void {
  if (el.dataset.textoryHighlighted === '1') return;

  const code = el.textContent || '';
  if (!code) {
    el.dataset.textoryHighlighted = '1';
    return;
  }

  const lang = resolveLanguage(el.className);
  let result;
  try {
    result = lang
      ? lowlight.highlight(lang, code)
      : lowlight.highlightAuto(code);
  } catch {
    // 语言未注册或解析失败，fallback plaintext
    try {
      result = lowlight.highlight('plaintext', code);
    } catch {
      el.dataset.textoryHighlighted = '1';
      return;
    }
  }

  el.innerHTML = serializeHast(result as unknown as HastNode);
  el.classList.add('hljs');
  el.dataset.textoryHighlighted = '1';
}

/**
 * 扫描 root 下所有 `<pre><code>` 块并应用高亮。
 *
 * @param root 默认 `document`。可传任意 ParentNode（如 `.post-content` 容器）限定范围
 */
export function highlightAll(root: ParentNode = document): void {
  const blocks = root.querySelectorAll('pre code');
  blocks.forEach((el) => {
    if (el instanceof HTMLElement) {
      highlightElement(el);
    }
  });
}

const TextoryHighlight = {
  highlightAll,
  highlightElement,
};

export {TextoryHighlight};
export default TextoryHighlight;
