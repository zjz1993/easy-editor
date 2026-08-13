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
  /** 是否启用图片点击预览（lightbox），默认 true。
   * 点击 content 内 <img> 弹出全屏预览，支持上/下张、缩放、旋转、下载。
   * 图片若在 <a> 内则不拦截（保留链接默认行为） */
  preview?: boolean;
  /** 是否对入参 html 先做 XSS 净化（删 script/iframe/on* 事件属性/javascript: 协议等），默认 true。
   * 渲染场景常接 DB 取出的帖子 HTML，开启后即便有人塞了 script 标签也不会执行 */
  sanitize?: boolean;
  /** 入参 html 是否来自 Discuz 这种服务端做过 htmlspecialchars 的存储。
   * 开启后先把 &lt; &gt; &quot; &#039; &amp; 还原回原始字符，再交给 sanitize/渲染。
   * 默认 false。Discuz/PHP BBCode 站点设 true */
  fromDiscuz?: boolean;
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

// ────────────── 入参预处理：Discuz 实体还原 + XSS 净化 ──────────────
// Discuz 服务端默认对帖子内容跑 htmlspecialchars（allowhtml=0）：
//   < > " ' &  →  &lt; &gt; &quot; &#039; &amp;
// textory 编辑器产出的真实 HTML（<div class="textory-block-container">...）
// 存库后也被转义，渲染时若直接 innerHTML，浏览器会把实体当成文本字符显示，
// 用户看到的就是 "<div class="textory-block-container">..." 这种泄露的标签字符串。
//
// decodeDiscuzHtml：先把实体还原回真实 HTML 字符串。
// 顺序关键：&amp; 必须第一个还原。否则 &amp;lt; 会被错误地二次解码成 <。
//
// sanitizeHtml：DOM-based 净化。建临时 div、parse 实体还原后的 HTML、
// 删危险标签/属性。比纯正则鲁棒（浏览器 parser 已处理畸形标签）。
//
// 二者配合：DB 取出的转义串 → decode → 原始 HTML → sanitize → 安全 HTML → innerHTML。

/**
 * 还原 HTML 实体（包含 Discuz/PHP htmlspecialchars 产出 + textory 自产 &nbsp; 等）。
 * 用浏览器 DOM parser 一次性解码，比正则列表可靠：
 *   - 覆盖所有 named entity（&nbsp; &hellip; &mdash; &ldquo; ...）和 numeric entity（&#039; &#x27; ...）
 *   - 不执行脚本（textarea 只接 text，<script> 会被当作文本字符）
 *   - 不丢失任何实体（正则列表常漏 &nbsp; 这种非 htmlspecialchars 产出）
 *
 * 调用方拿到解码后的字符串后应再过 sanitizeHtml。
 */
export function decodeDiscuzHtml(input: unknown): string {
  if (input == null) return '';
  const s = String(input);
  if (s.indexOf('&') === -1) return s; // 无实体快路径
  const ta = document.createElement('textarea');
  ta.innerHTML = s;
  return ta.value;
}

/** 删除危险标签的 selector。这些标签要么直接执行 JS，要么能拉外部资源/重定向 */
const SANITIZER_STRIP_SELECTOR =
  'script,style,link,iframe,frame,object,embed,meta,base,form,button,input,textarea,svg,math';

/** 危险属性前缀：on*（onerror/onclick/...）、formaction 等 */
const SANITIZER_ATTR_DANGEROUS_NAME = /^on/i;
/** formaction/onerror 等也可能落在非 on* 名字里，但 on* 已覆盖 95%。
 *  下面这些单独列：它们不执行 JS，但可被钓鱼/重定向滥用 */
const SANITIZER_ATTR_DROP_NAMES = new Set([
  'formaction',
  'xlink:href',
  'xml:base',
]);

/**
 * DOM-based XSS 净化。
 *
 * 思路：用浏览器 parser 把字符串变成 DOM 树，然后 walk 树删节点/属性。
 * 比正则可靠——畸形标签、comments、CDATA、命名空间混淆都能被 parser 规整化。
 *
 * 处理：
 *   0. 暂存 <pre>/<code> 子树内容并清空——代码块里的 <form>/<script>/<svg> 是
 *      用户的代码示例文本，不是要执行的 HTML，sanitize 不应碰。
 *      做法：存原始 innerHTML 到数组，textContent 置空，挂 data-textory-code-idx。
 *   1. 删整个危险标签（script/iframe/object/...）—— 不保留子内容
 *   2. 删所有 on* 属性
 *   3. 删 formaction/xlink:href 等单独列的高危属性
 *   4. 校验 href/src/action 的协议白名单：javascript:/vbscript:/data:（HTML 上下文）一律删
 *      保留 http/https/mailto/tel/ftp/相对路径/锚点
 *   5. 还原代码块原始内容
 *
 * @param html 原始 HTML 字符串
 * @returns 净化后的 HTML 字符串，可直接赋给 innerHTML
 */
export function sanitizeHtml(html: string): string {
  if (!html) return '';
  const tmp = document.createElement('div');
  tmp.innerHTML = html;

  // 0. 暂存 pre/code 内容
  //    textContent 置空避免子树里的 <script>/<form>/on* 被 1-3 步误删
  //    pre 本身（容器）保留，仅清子节点
  const codeStore: string[] = [];
  tmp.querySelectorAll('pre, code').forEach((el) => {
    const idx = codeStore.length;
    codeStore.push(el.innerHTML);
    el.textContent = '';
    el.setAttribute('data-textory-code-idx', String(idx));
  });

  // 1. 删危险标签（整棵子树）
  tmp.querySelectorAll(SANITIZER_STRIP_SELECTOR).forEach((n) => n.remove());

  // 2. walk 所有剩余元素，清属性
  const all = tmp.querySelectorAll('*');
  all.forEach((el) => {
    // 复制 attributes 列表再迭代——迭代中 removeAttribute 会破坏 live NodeList
    const attrs = Array.from(el.attributes);
    for (const attr of attrs) {
      const name = attr.name.toLowerCase();
      const value = attr.value;

      // on* 事件属性
      if (SANITIZER_ATTR_DANGEROUS_NAME.test(name)) {
        el.removeAttribute(attr.name);
        continue;
      }
      // 单独列的高危属性
      if (SANITIZER_ATTR_DROP_NAMES.has(name)) {
        el.removeAttribute(attr.name);
        continue;
      }
      // URL 类属性：拦截 javascript:/vbscript:/data:text/html 等
      if (name === 'href' || name === 'src' || name === 'action' || name === 'formaction' || name === 'poster' || name === 'background' || name === 'cite') {
        if (isDangerousUrl(value)) {
          el.removeAttribute(attr.name);
        }
      }
    }
  });

  // 3. 删注释节点（IE conditional comments、`<!--[if IE]><script>` 之类）
  const walker = document.createTreeWalker(tmp, NodeFilter.SHOW_COMMENT);
  const comments: Comment[] = [];
  while (walker.nextNode()) comments.push(walker.currentNode as Comment);
  comments.forEach((c) => c.parentNode?.removeChild(c));

  // 4. 还原代码块内容（容器已 sanitize 完，原始代码文本塞回）
  tmp.querySelectorAll('[data-textory-code-idx]').forEach((el) => {
    const idx = Number.parseInt(el.getAttribute('data-textory-code-idx') || '-1', 10);
    el.removeAttribute('data-textory-code-idx');
    if (idx >= 0 && codeStore[idx] !== undefined) {
      el.innerHTML = codeStore[idx];
    }
  });

  return tmp.innerHTML;
}

/** 判断 URL 是否危险（在 href/src/action 等位置上可执行脚本或加载恶意资源） */
function isDangerousUrl(raw: string): boolean {
  if (!raw) return false;
  const v = raw.trim().toLowerCase();
  // 协议白名单：常见无副作用 scheme + 相对/锚点
  //  - http/https/mailto/tel/ftp/ftps 普通资源
  //  - #/.///  锚点 / 相对路径 / 协议相对 URL
  //  - data:image/*  仅图片 data URI 安全（SVG data URI 例外，但 SVG 标签已被 selector 删了）
  const SAFE_URL = /^(https?:|mailto:|tel:|ftp:|ftps:|\/|#|\.|\?|data:image\/(?!svg))/i;
  // javascript:/vbscript:/data:text/html 等 = 不在白名单 → 危险
  // 也拦"  javascript:..." 这种带空白/控制字符的绕过尝试
  return !SAFE_URL.test(v);
}

/** 入参 html 预处理管道：按需 decode → 按需 sanitize */
function preprocessHtml(html: string | undefined, fromDiscuz: boolean, sanitize: boolean): string {
  if (html === undefined) return '';
  let out = html;
  if (fromDiscuz) out = decodeDiscuzHtml(out);
  if (sanitize) out = sanitizeHtml(out);
  return out;
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

// ────────────── 图片预览 lightbox（vanilla DOM） ──────────────
// 渲染侧图片点击放大。点击 content 内 <img> 弹出全屏 lightbox：
// 上/下张、缩放、旋转、下载、ESC关闭、点击遮罩关闭、左右箭头键切换。
//
// 不复用 editor 内部 FilePreview React 组件（耦合 editor state 太深），
// 这里 vanilla DOM 全量重写。单例：同时只有一个 overlay。
// overlay append 到 document.body，避免 .textory-body overflow / stacking context 干扰。

const PREVIEW_STYLE_ID = 'textory-render-preview-style';
function ensurePreviewStyle() {
  if (document.getElementById(PREVIEW_STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = PREVIEW_STYLE_ID;
  style.textContent = `
.textory-render-preview{position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,.88);display:flex;flex-direction:column;color:#fff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;user-select:none;}
.textory-render-preview__header{display:flex;align-items:center;padding:10px 16px;min-height:48px;background:rgba(0,0,0,.4);flex-shrink:0;gap:12px;}
.textory-render-preview__counter{font-size:13px;color:#bbb;flex-shrink:0;}
.textory-render-preview__name{font-size:13px;color:#fff;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.textory-render-preview__btn{background:transparent;border:0;color:#fff;cursor:pointer;padding:6px 10px;font-size:13px;border-radius:4px;display:inline-flex;align-items:center;gap:4px;line-height:1;}
.textory-render-preview__btn:hover{background:rgba(255,255,255,.15);}
.textory-render-preview__btn:disabled{opacity:.35;cursor:not-allowed;}
.textory-render-preview__body{flex:1;position:relative;overflow:hidden;display:flex;align-items:center;justify-content:center;padding:0 64px;}
.textory-render-preview__img-wrap{flex:1;display:flex;align-items:center;justify-content:center;width:100%;height:100%;overflow:hidden;}
.textory-render-preview__img{max-width:100%;max-height:100%;transition:transform .15s ease;cursor:grab;object-fit:contain;}
.textory-render-preview__img:active{cursor:grabbing;}
.textory-render-preview__arrow{position:absolute;top:50%;transform:translateY(-50%);width:44px;height:44px;border-radius:50%;background:rgba(0,0,0,.5);color:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer;border:0;padding:0;}
.textory-render-preview__arrow:hover{background:rgba(0,0,0,.75);}
.textory-render-preview__arrow:disabled{opacity:.3;cursor:not-allowed;}
.textory-render-preview__arrow--prev{left:12px;}
.textory-render-preview__arrow--next{right:12px;}
.textory-render-preview__controls{position:absolute;bottom:20px;left:50%;transform:translateX(-50%);display:flex;align-items:center;gap:4px;background:rgba(0,0,0,.6);padding:6px 8px;border-radius:24px;}
.textory-render-preview__scale{font-size:12px;color:#ddd;min-width:46px;text-align:center;}
@media (max-width:640px){
  .textory-render-preview__body{padding:0 8px;}
  .textory-render-preview__arrow{width:36px;height:36px;}
  .textory-render-preview__name{max-width:140px;}
}
`;
  document.head.appendChild(style);
}

const PREV_ICON = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>';
const NEXT_ICON = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>';
const CLOSE_ICON = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
const ZOOM_IN_ICON = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>';
const ZOOM_OUT_ICON = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/></svg>';
const ROTATE_ICON = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>';
const RESET_ICON = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9"/><polyline points="3 4 3 12 11 12"/></svg>';
const DOWNLOAD_ICON = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>';

interface PreviewState {
  images: HTMLImageElement[];
  index: number;
  scale: number;
  rotate: number;
  translateX: number;
  translateY: number;
  overlay: HTMLElement;
  imgEl: HTMLImageElement;
  counterEl: HTMLElement;
  nameEl: HTMLElement;
  prevBtn: HTMLButtonElement;
  nextBtn: HTMLButtonElement;
  scaleEl: HTMLElement;
  dragStart: {x: number; y: number; ox: number; oy: number} | null;
  keyHandler: (e: KeyboardEvent) => void;
  wheelHandler: (e: WheelEvent) => void;
}

let previewState: PreviewState | null = null;

function deriveImageName(img: HTMLImageElement): string {
  return (
    img.getAttribute('alt') ||
    img.getAttribute('title') ||
    img.dataset.name ||
    (img.src ? decodeURIComponent(img.src.split('/').pop() || '').split('?')[0] : '') ||
    'image'
  );
}

function applyTransform(state: PreviewState) {
  const {scale, rotate, translateX, translateY} = state;
  state.imgEl.style.transform =
    `translate(${translateX}px, ${translateY}px) scale(${scale}) rotate(${rotate}deg)`;
}

function renderPreview(state: PreviewState) {
  const img = state.images[state.index];
  if (!img) return;
  state.imgEl.src = img.src;
  state.imgEl.alt = img.alt || '';
  state.counterEl.textContent = `${state.index + 1} / ${state.images.length}`;
  state.nameEl.textContent = deriveImageName(img);
  state.prevBtn.disabled = state.index <= 0;
  state.nextBtn.disabled = state.index >= state.images.length - 1;
  // 重置 transform
  state.scale = 1;
  state.rotate = 0;
  state.translateX = 0;
  state.translateY = 0;
  state.scaleEl.textContent = '100%';
  applyTransform(state);
}

function openPreview(images: HTMLImageElement[], startIndex: number) {
  if (images.length === 0) return;
  if (previewState) closePreview();
  ensurePreviewStyle();

  const overlay = document.createElement('div');
  overlay.className = 'textory-render-preview';

  // ── header ──
  const header = document.createElement('div');
  header.className = 'textory-render-preview__header';

  const counter = document.createElement('span');
  counter.className = 'textory-render-preview__counter';
  header.appendChild(counter);

  const name = document.createElement('span');
  name.className = 'textory-render-preview__name';
  header.appendChild(name);

  const dlBtn = document.createElement('button');
  dlBtn.type = 'button';
  dlBtn.className = 'textory-render-preview__btn';
  dlBtn.title = '下载';
  dlBtn.innerHTML = `${DOWNLOAD_ICON}<span>下载</span>`;
  dlBtn.addEventListener('click', () => {
    const cur = previewState?.images[previewState.index];
    if (!cur) return;
    downloadImage(cur);
  });
  header.appendChild(dlBtn);

  const closeBtn = document.createElement('button');
  closeBtn.type = 'button';
  closeBtn.className = 'textory-render-preview__btn';
  closeBtn.title = '关闭 (Esc)';
  closeBtn.innerHTML = CLOSE_ICON;
  closeBtn.addEventListener('click', closePreview);
  header.appendChild(closeBtn);

  overlay.appendChild(header);

  // ── body ──
  const body = document.createElement('div');
  body.className = 'textory-render-preview__body';

  const prevArrow = document.createElement('button');
  prevArrow.type = 'button';
  prevArrow.className = 'textory-render-preview__arrow textory-render-preview__arrow--prev';
  prevArrow.innerHTML = PREV_ICON;
  prevArrow.addEventListener('click', (e) => {
    e.stopPropagation();
    navPreview(-1);
  });
  body.appendChild(prevArrow);

  const imgWrap = document.createElement('div');
  imgWrap.className = 'textory-render-preview__img-wrap';
  const imgEl = document.createElement('img');
  imgEl.className = 'textory-render-preview__img';
  imgEl.draggable = false;
  // 点击图片本体不关闭（防止误触）；点击 wrap 空白处关闭
  imgEl.addEventListener('click', (e) => e.stopPropagation());
  // 拖拽 pan：任意 scale 都可拖
  imgEl.addEventListener('mousedown', (e) => {
    if (!previewState) return;
    e.preventDefault();
    previewState.dragStart = {
      x: e.clientX, y: e.clientY,
      ox: previewState.translateX, oy: previewState.translateY,
    };
  });
  imgWrap.appendChild(imgEl);
  imgWrap.addEventListener('click', closePreview);
  body.appendChild(imgWrap);

  const nextArrow = document.createElement('button');
  nextArrow.type = 'button';
  nextArrow.className = 'textory-render-preview__arrow textory-render-preview__arrow--next';
  nextArrow.innerHTML = NEXT_ICON;
  nextArrow.addEventListener('click', (e) => {
    e.stopPropagation();
    navPreview(1);
  });
  body.appendChild(nextArrow);

  overlay.appendChild(body);

  // ── controls ──
  const controls = document.createElement('div');
  controls.className = 'textory-render-preview__controls';

  const zoomOutBtn = document.createElement('button');
  zoomOutBtn.type = 'button';
  zoomOutBtn.className = 'textory-render-preview__btn';
  zoomOutBtn.title = '缩小';
  zoomOutBtn.innerHTML = ZOOM_OUT_ICON;
  zoomOutBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    zoomPreview(-0.15);
  });
  controls.appendChild(zoomOutBtn);

  const scaleText = document.createElement('span');
  scaleText.className = 'textory-render-preview__scale';
  scaleText.textContent = '100%';
  controls.appendChild(scaleText);

  const zoomInBtn = document.createElement('button');
  zoomInBtn.type = 'button';
  zoomInBtn.className = 'textory-render-preview__btn';
  zoomInBtn.title = '放大';
  zoomInBtn.innerHTML = ZOOM_IN_ICON;
  zoomInBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    zoomPreview(0.15);
  });
  controls.appendChild(zoomInBtn);

  const rotateBtn = document.createElement('button');
  rotateBtn.type = 'button';
  rotateBtn.className = 'textory-render-preview__btn';
  rotateBtn.title = '旋转 90°';
  rotateBtn.innerHTML = ROTATE_ICON;
  rotateBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    rotatePreview();
  });
  controls.appendChild(rotateBtn);

  const resetBtn = document.createElement('button');
  resetBtn.type = 'button';
  resetBtn.className = 'textory-render-preview__btn';
  resetBtn.title = '重置';
  resetBtn.innerHTML = RESET_ICON;
  resetBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (!previewState) return;
    previewState.scale = 1;
    previewState.rotate = 0;
    previewState.translateX = 0;
    previewState.translateY = 0;
    previewState.scaleEl.textContent = '100%';
    applyTransform(previewState);
  });
  controls.appendChild(resetBtn);

  overlay.appendChild(controls);
  // 阻止 controls 冒泡触发 body 关闭
  controls.addEventListener('click', (e) => e.stopPropagation());

  document.body.appendChild(overlay);

  const keyHandler = (e: KeyboardEvent) => {
    if (!previewState) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      closePreview();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      navPreview(-1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      navPreview(1);
    } else if (e.key === '+' || e.key === '=') {
      zoomPreview(0.15);
    } else if (e.key === '-') {
      zoomPreview(-0.15);
    } else if (e.key === '0') {
      if (!previewState) return;
      previewState.scale = 1;
      previewState.rotate = 0;
      previewState.translateX = 0;
      previewState.translateY = 0;
      previewState.scaleEl.textContent = '100%';
      applyTransform(previewState);
    }
  };

  const wheelHandler = (e: WheelEvent) => {
    if (!previewState) return;
    e.preventDefault();
    zoomPreview(e.deltaY < 0 ? 0.1 : -0.1);
  };

  // 全局 mouseup 监听拖拽结束
  const mouseMoveHandler = (e: MouseEvent) => {
    if (!previewState?.dragStart) return;
    previewState.translateX = previewState.dragStart.ox + (e.clientX - previewState.dragStart.x);
    previewState.translateY = previewState.dragStart.oy + (e.clientY - previewState.dragStart.y);
    applyTransform(previewState);
  };
  const mouseUpHandler = () => {
    if (previewState) previewState.dragStart = null;
  };

  document.addEventListener('keydown', keyHandler);
  overlay.addEventListener('wheel', wheelHandler, {passive: false});
  document.addEventListener('mousemove', mouseMoveHandler);
  document.addEventListener('mouseup', mouseUpHandler);

  // 锁滚动
  const prevBodyOverflow = document.body.style.overflow;
  document.body.style.overflow = 'hidden';

  const state: PreviewState = {
    images,
    index: Math.max(0, Math.min(startIndex, images.length - 1)),
    scale: 1,
    rotate: 0,
    translateX: 0,
    translateY: 0,
    overlay,
    imgEl,
    counterEl: counter,
    nameEl: name,
    prevBtn: prevArrow,
    nextBtn: nextArrow,
    scaleEl: scaleText,
    dragStart: null,
    keyHandler,
    wheelHandler,
  };

  // 保存清理函数到 overlay 上，closePreview 时取用
  (overlay as any)._cleanup = () => {
    document.removeEventListener('keydown', keyHandler);
    overlay.removeEventListener('wheel', wheelHandler);
    document.removeEventListener('mousemove', mouseMoveHandler);
    document.removeEventListener('mouseup', mouseUpHandler);
    document.body.style.overflow = prevBodyOverflow;
  };

  previewState = state;
  renderPreview(state);
}

function closePreview() {
  if (!previewState) return;
  const overlay = previewState.overlay;
  const cleanup = (overlay as any)._cleanup as (() => void) | undefined;
  cleanup?.();
  if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
  previewState = null;
}

function navPreview(delta: number) {
  if (!previewState) return;
  const next = previewState.index + delta;
  if (next < 0 || next >= previewState.images.length) return;
  previewState.index = next;
  renderPreview(previewState);
}

function zoomPreview(delta: number) {
  if (!previewState) return;
  const next = Math.min(5, Math.max(0.2, previewState.scale + delta));
  previewState.scale = next;
  previewState.scaleEl.textContent = `${Math.round(next * 100)}%`;
  // 缩回 1 时清掉 pan
  if (next <= 1) {
    previewState.translateX = 0;
    previewState.translateY = 0;
  }
  applyTransform(previewState);
}

function rotatePreview() {
  if (!previewState) return;
  previewState.rotate = (previewState.rotate + 90) % 360;
  applyTransform(previewState);
}

async function downloadImage(img: HTMLImageElement) {
  const url = img.src;
  if (!url) return;
  const name = deriveImageName(img) || 'image';
  try {
    const res = await fetch(url, { mode: 'cors' });
    if (!res.ok) throw new Error(`status ${res.status}`);
    const blob = await res.blob();
    const objUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = objUrl;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(objUrl);
  } catch {
    // CORS 失败回退：新标签打开（浏览器 navigate，仍可右键另存）
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    a.target = '_blank';
    a.rel = 'noopener';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}

// content root 上事件委托：点击 <img> 触发 lightbox
function attachImagePreview(root: HTMLElement): () => void {
  const handler = (e: Event) => {
    const target = e.target as HTMLElement;
    if (target.tagName !== 'IMG') return;
    const img = target as HTMLImageElement;
    // 跳过显式禁用的图片（如内联图标/emoji）
    if (img.getAttribute('data-textory-no-preview') === '1') return;
    if (img.closest('a')) {
      // 图片在 <a> 里：让 <a> 默认行为优先（下载/跳转），不拦截
      return;
    }
    const all = Array.from(root.querySelectorAll('img')).filter(
      (i) => i.getAttribute('data-textory-no-preview') !== '1',
    );
    const idx = all.indexOf(img);
    if (idx < 0) return;
    e.preventDefault();
    openPreview(all, idx);
  };
  root.addEventListener('click', handler);
  return () => root.removeEventListener('click', handler);
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
    preview: previewEnabled = true,
    sanitize: sanitizeEnabled = true,
    fromDiscuz = false,
  } = options;

  // 入参 html 预处理：Discuz 实体还原 + XSS 净化
  const processedHtml = preprocessHtml(html, fromDiscuz, sanitizeEnabled);

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
  if (processedHtml) {
    contentInner.innerHTML = processedHtml;
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
      // 内容无标题时彻底隐藏 outlineHost（display:none，宽度也释放）
      onEmptyChange: (empty) => {
        if (!outlineHost) return;
        outlineHost.style.display = empty ? 'none' : '';
        if (!empty) {
          // 恢复时还原配置宽度（与 onCollapsedChange 协同）
          outlineHost.style.width = outlineInst?.isCollapsed()
            ? '0'
            : `${outlineWidth}px`;
        }
      },
    });
  }

  // 图片点击预览：事件委托挂在 contentInner，setHTML/refresh 后无需重新绑定
  let detachPreview: (() => void) | null = null;
  if (previewEnabled) {
    detachPreview = attachImagePreview(contentInner);
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
      // 关闭可能开着的 lightbox（避免孤儿 overlay）
      if (previewState) closePreview();
      detachPreview?.();
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
