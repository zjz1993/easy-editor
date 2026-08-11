/**
 * Standalone render facade.
 *
 * 一个 API 同时搞定：
 * 1. 把 editor.getHTML() 产出的 HTML 字符串包装进 .textory 容器
 * 2. 跑语法高亮（复用 highlight.ts）
 * 3. 挂标题导航 outline（复用 outline.ts）
 *
 * 用户无需自己写 layout HTML，给一个 div 即可：
 *
 * ```html
 * <div id="post-target" style="max-width: 1100px; margin: 0 auto;"></div>
 *
 * <link rel="stylesheet" href="textory.min.css">     <!-- 含 outline/highlight 样式 -->
 * <link rel="stylesheet" href="highlight.min.css">   <!-- 仅 hljs 调色板，可选 -->
 * <script src="render.min.js"></script>
 * <script>
 *   TextoryRender.create('#post-target', {
 *     html: '<p>帖子内容</p><pre><code class="language-js">...</code></pre>',
 *     headerOffsetPx: 60,   // sticky header 高度
 *   });
 * </script>
 * ```
 *
 * bundle 内联了 highlight + outline，无需额外引脚本。
 * 体积 ~170KB（gzip ~60KB），单 script 单 API。
 */
import {highlightAll} from './highlight';
import {create as createOutline, type OutlineInstance} from './outline';

// ────────────── 类型 ──────────────
export interface RenderOptions {
  /** 初始 HTML 内容（通常是 editor.getHTML() 的产出）。不传则空容器 */
  html?: string;
  /** 滚动容器，默认 window */
  scrollContainer?: HTMLElement | Window;
  /** sticky header 偏移，避免 outline 跳转时被遮挡，默认 0 */
  headerOffsetPx?: number;
  /** 是否挂 outline 面板，默认 true */
  outline?: boolean;
  /** 是否跑语法高亮，默认 true */
  highlight?: boolean;
  /** outline 面板宽度（px），默认 240 */
  outlineWidth?: number;
  /** outline 初始是否折叠二级以下，默认 false */
  outlineCollapsed?: boolean;
  /** 给 .textory 容器额外加 className（用于业务侧自定义样式 hook） */
  contentClassName?: string;
}

export interface RenderInstance {
  /** 读取当前 HTML（已应用高亮，含 hljs spans） */
  getHTML(): string;
  /** 替换 HTML，自动重跑 highlight + refresh outline */
  setHTML(html: string): void;
  /** 手动刷新（DOM 被外部改过后调） */
  refresh(): void;
  /** 销毁：清空挂载点 + 解绑事件 */
  destroy(): void;
  /** 拿内部 outline 实例（用于 expandAll/collapseAll 等操作） */
  getOutline(): OutlineInstance | null;
  /** 拿 .textory 容器 element（业务侧自定义样式 hook） */
  getContentEl(): HTMLElement;
}

// ────────────── 复制按钮样式（幂等注入） ──────────────
// 单独函数，create 时调一次。多次调用通过 style tag id 去重。
// 设计：wrapper position:relative，按钮 absolute top-right。
// 不能把按钮直接放 pre 里——pre overflow-x:auto 会让按钮随横向滚动跑掉。
const COPY_STYLE_ID = 'textory-render-copy-btn-style';
function ensureCopyStyle() {
  if (document.getElementById(COPY_STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = COPY_STYLE_ID;
  style.textContent = `
.textory-pre-wrapper { position: relative; }
.textory-copy-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  padding: 4px 10px;
  font-size: 12px;
  line-height: 1.2;
  background: rgba(255, 255, 255, 0.08);
  color: #abb2bf;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 4px;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.15s ease, background-color 0.15s ease, border-color 0.15s ease;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  user-select: none;
  z-index: 1;
}
.textory-pre-wrapper:hover .textory-copy-btn { opacity: 1; }
.textory-copy-btn:hover {
  background: rgba(255, 255, 255, 0.18);
  border-color: rgba(255, 255, 255, 0.3);
}
.textory-copy-btn.copied {
  background: #98c379;
  color: #fff;
  border-color: #98c379;
  opacity: 1;
}
`;
  document.head.appendChild(style);
}

function fallbackCopyText(text: string): boolean {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.top = '-9999px';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.select();
  let ok = false;
  try {
    ok = document.execCommand('copy');
  } catch {
    ok = false;
  }
  document.body.removeChild(ta);
  return ok;
}

function copyCodeFromPre(pre: HTMLElement, btn: HTMLButtonElement) {
  const code = pre.querySelector('code');
  const text = (code?.textContent ?? pre.textContent ?? '').replace(/\u00a0/g, ' ');
  const done = () => {
    btn.classList.add('copied');
    const prev = btn.textContent;
    btn.textContent = '已复制';
    window.setTimeout(() => {
      btn.classList.remove('copied');
      if (prev != null) btn.textContent = prev;
    }, 1500);
  };
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(text).then(done, () => {
      if (fallbackCopyText(text)) done();
    });
  } else {
    if (fallbackCopyText(text)) done();
  }
}

// ────────────── NodeView 类回填 + 横向滚动包装 ──────────────
// 编辑器 NodeView 在 runtime 给某些节点加包装 class（如 .textory-table），
// getHTML() 产出的 HTML 不带这些 class，导致样式失配。这里扫描补齐。
//
// 同时给超宽块（table/pre）加横向滚动 wrapper：
// - .textory-body 父容器（contentInner）虽有 overflow-x:auto，但 table/pre 子元素
//   min-width:min-content 会撑破父宽度，父级滚动条不出现，内容被截断或溢出可见区域。
// - 解决：table 包一层 div.overflow-x:auto；pre 直接 inline overflow-x:auto。
//   子元素自身滚动，父级 layout 不受影响。
//
// 当前覆盖：
// - <table> 缺 .textory-table → table.scss 全部样式失效（边框/padding/table-layout）
// - <table> 包装 div.textory-render-table-scroll（横向滚动）
// - <pre> inline overflow-x:auto（横向滚动）
//
// 不需要回填的：
// - <td> 已在 schema renderHTML 写死 textory-table-cell（持久化）
// - <ul data-type="taskList"> / <li data-type="taskItem"> schema 层 tag 解析（持久化）
// - <pre><code class="language-xxx"> 由 highlightAll() 加 .hljs
// - <img>/<video> NodeView 容器类（textory-image-container 等）渲染侧不需要，
//   bare <img>/<video> 用默认浏览器样式即可
function patchNodeViewClasses(root: HTMLElement) {
  // table: 补 .textory-table class + 包装横向滚动 wrapper
  root.querySelectorAll('table').forEach(t => {
    if (!t.classList.contains('textory-table')) {
      t.classList.add('textory-table');
    }
    // 避免重复包装（setHTML/refresh 多次调用）
    const parent = t.parentElement;
    if (parent?.classList.contains('textory-render-table-scroll')) return;
    const wrap = document.createElement('div');
    wrap.className = 'textory-render-table-scroll';
    wrap.style.overflowX = 'auto';
    wrap.style.maxWidth = '100%';
    wrap.style.margin = '8px 0';
    parent?.insertBefore(wrap, t);
    wrap.appendChild(t);
  });

  // pre: inline overflow-x:auto + 包装 div.textory-pre-wrapper（放复制按钮）
  // 包装而不是直接子：pre overflow-x:auto 会让按钮随横向滚动跑掉
  root.querySelectorAll('pre').forEach(p => {
    p.style.overflowX = 'auto';
    p.style.maxWidth = '100%';

    const parent = p.parentElement;
    // 已包装：跳过（setHTML/refresh 多次调用）
    if (parent?.classList.contains('textory-pre-wrapper')) return;

    const wrap = document.createElement('div');
    wrap.className = 'textory-pre-wrapper';
    parent?.insertBefore(wrap, p);
    wrap.appendChild(p);

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'textory-copy-btn';
    btn.textContent = '复制';
    btn.addEventListener('click', () => copyCodeFromPre(p, btn));
    wrap.appendChild(btn);
  });
}

// ────────────── 公开 API ──────────────
export function create(
  target: HTMLElement | string,
  options: RenderOptions = {},
): RenderInstance {
  const el =
    typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target;
  if (!el) {
    throw new Error(`[TextoryRender] target not found: ${target}`);
  }

  // 注入复制按钮样式（幂等）
  ensureCopyStyle();

  const {
    html,
    scrollContainer = window,
    headerOffsetPx = 0,
    outline: outlineEnabled = true,
    highlight: highlightEnabled = true,
    outlineWidth = 240,
    outlineCollapsed = false,
    contentClassName,
  } = options;

  // 清空 target
  el.innerHTML = '';

  // 外层 wrap：复用 .textory class（编辑器排版 scope）+ inline 覆盖 CSS 默认值
  // .textory 默认 display:flex; flex-direction:column; height:100%（root.scss:12-17）
  // 渲染场景需 row 横向布局（content + outline 并排）+ height:auto（不强制撑高）
  const wrap = document.createElement('div');
  wrap.className = 'textory';
  wrap.style.display = 'flex';
  wrap.style.flexDirection = 'row';
  wrap.style.alignItems = 'flex-start';
  wrap.style.gap = '24px';
  wrap.style.width = '100%';
  wrap.style.height = 'auto';

  // .textory-body：编辑器主体容器
  // .textory-body CSS 默认 overflow:auto（root.scss:240）——会让 sticky 相对该 ancestor
  // 失效。inline 覆盖 overflow:visible，让 sticky 相对 window 工作
  const content = document.createElement('div');
  content.className = 'textory-body';
  if (contentClassName) {
    content.classList.add(...contentClassName.split(/\s+/).filter(Boolean));
  }
  content.style.flex = '1 1 0';
  content.style.minWidth = '0'; // 关键：让 flex item 能收缩，否则 table/video 撑开
  content.style.overflow = 'visible';

  // .tiptap.ProseMirror：编辑器实际内容容器（CSS 在 .textory-body 下 scope）
  // 加 min-width:0 + overflow-x:auto 让超宽 table 在内部滚动而非撑出 .textory-body
  const contentInner = document.createElement('div');
  contentInner.classList.add('tiptap', 'ProseMirror');
  contentInner.style.minWidth = '0';
  contentInner.style.overflowX = 'auto';
  if (html !== undefined) {
    contentInner.innerHTML = html;
    patchNodeViewClasses(contentInner);
  }
  content.appendChild(contentInner);
  wrap.appendChild(content);

  // outline 挂载点：必须 append 到 wrap（与 content sibling），不能在 content 内部
  // 原因：1) .textory-body overflow:auto 会让 sticky 失效
  //       2) outlineHost 在 .textory-body 内会被当作 flex item，跟 contentInner 并排挤占宽度
  let outlineHost: HTMLElement | null = null;
  if (outlineEnabled) {
    outlineHost = document.createElement('aside');
    outlineHost.className = 'textory-render-outline-host';
    outlineHost.style.width = `${outlineWidth}px`;
    outlineHost.style.flexShrink = '0';
    outlineHost.style.position = 'sticky';
    outlineHost.style.top = `${headerOffsetPx + 20}px`;
    outlineHost.style.maxHeight = `calc(100vh - ${headerOffsetPx + 40}px)`;
    outlineHost.style.overflowY = 'auto';
    wrap.appendChild(outlineHost);
  }

  el.appendChild(wrap);

  // 语法高亮
  if (highlightEnabled) {
    highlightAll(content);
  }

  // outline 实例
  let outlineInst: OutlineInstance | null = null;
  if (outlineHost) {
    outlineInst = createOutline({
      content,
      mount: outlineHost,
      scrollContainer,
      headerOffsetPx,
      defaultCollapsed: outlineCollapsed,
      // 面板隐藏时 outlineHost 宽度收到 0，给 content 让出空间
      // 恢复时还原配置宽度
      // overflow 切换：collapsed 时 visible 让 restoreBtn 绝对定位出 0 宽容器外
      // （CSS spec：overflow-y:auto 会强制 overflow-x 也 auto，clip 掉按钮）
      onCollapsedChange: (collapsed) => {
        if (!outlineHost) return;
        outlineHost.style.width = collapsed ? '0' : `${outlineWidth}px`;
        outlineHost.style.overflow = collapsed ? 'visible' : 'auto';
      },
    });
  }

  return {
    getHTML() {
      return contentInner.innerHTML;
    },
    setHTML(next) {
      contentInner.innerHTML = next;
      patchNodeViewClasses(contentInner);
      if (highlightEnabled) highlightAll(content);
      outlineInst?.refresh();
    },
    refresh() {
      patchNodeViewClasses(contentInner);
      if (highlightEnabled) highlightAll(content);
      outlineInst?.refresh();
    },
    destroy() {
      outlineInst?.destroy();
      el.innerHTML = '';
    },
    getOutline() {
      return outlineInst;
    },
    getContentEl() {
      return content;
    },
  };
}

const TextoryRender = {create};

export {TextoryRender};
export default TextoryRender;
