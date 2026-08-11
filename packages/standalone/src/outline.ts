/**
 * Standalone outline (TOC / heading navigation) bundle.
 *
 * 用于把编辑器产出的 HTML（渲染侧 `<div class="textory">...</div>`）
 * 重新挂上右侧标题导航面板。复用 `packages/editor-style/src/components/outline.scss`
 * 的 class 名，所以无需额外 CSS——只要页面引了 `textory.min.css` 即可。
 *
 * 与编辑器内部 OutlineView 的差异：
 * - 不依赖 Tiptap/ProseMirror（无 `editor.view.domAtPos()`）
 * - 直接扫 DOM `<h1>`~`<h6>`
 * - flash 通过 className 增删（编辑器走 ProseMirror decoration）
 * - scroll 高亮走 `getBoundingClientRect()` + scrollContainer 监听
 *
 * 用法：
 * ```html
 * <div class="layout">
 *   <div class="textory post-content">...</div>           <!-- 渲染容器 -->
 *   <aside id="outline-host"></aside>                      <!-- 挂载点 -->
 * </div>
 * <script src="outline.min.js"></script>
 * <script>
 *   TextoryOutline.create({
 *     content: document.querySelector('.post-content'),
 *     mount: document.getElementById('outline-host'),
 *     scrollContainer: window,
 *     headerOffsetPx: 60,
 *   });
 * </script>
 * ```
 */

// ────────────── 类型 ──────────────
interface Heading {
  el: HTMLHeadingElement;
  level: number; // 1-6
  text: string;
  id: string;
}

interface TreeNode extends Heading {
  children: TreeNode[];
}

export interface OutlineOptions {
  /** 含 h1-h6 的容器（通常是套了 .textory class 的渲染容器） */
  content: HTMLElement;
  /** outline panel 挂载点 */
  mount: HTMLElement;
  /** 滚动容器，默认 window。Sticky header 内嵌时传具体 HTMLElement */
  scrollContainer?: HTMLElement | Window;
  /** 点击 outline 跳转时，距视口顶部的偏移（避免被 sticky header 遮挡），默认 0 */
  headerOffsetPx?: number;
  /** 初始是否折叠全部二级及以下，默认 false */
  defaultCollapsed?: boolean;
  /** 面板显示/隐藏状态切换回调（facade 用来调整外层 layout 宽度） */
  onCollapsedChange?: (collapsed: boolean) => void;
}

export interface OutlineInstance {
  /** 销毁：解绑事件、清空挂载点 */
  destroy(): void;
  /** 展开全部节点 */
  expandAll(): void;
  /** 折叠全部二级及以下节点 */
  collapseAll(): void;
  /** 隐藏面板（仅保留恢复按钮） */
  collapse(): void;
  /** 显示面板 */
  expand(): void;
  /** 当前是否隐藏 */
  isCollapsed(): boolean;
  /** 手动刷新（DOM 内容变化后调用） */
  refresh(): void;
}

// ────────────── 工具 ──────────────
function ensureHeadingId(el: HTMLHeadingElement, idx: number): string {
  if (el.id) return el.id;
  // 从文本生成 slug，去重用 idx 兜底
  const slug = (el.textContent || 'heading')
    .trim()
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
    .replace(/^-+|-+$/g, '');
  const id = `textory-outline-${idx}-${slug || 'h'}`;
  el.id = id;
  return id;
}

function collectHeadings(content: HTMLElement): Heading[] {
  const els = Array.from(
    content.querySelectorAll<HTMLHeadingElement>('h1, h2, h3, h4, h5, h6'),
  );
  return els.map((el, idx) => {
    const level = Number(el.tagName.slice(1));
    return {
      el,
      level,
      text: (el.textContent || '').trim(),
      id: ensureHeadingId(el, idx),
    };
  });
}

/** 与 extension-outline 同样的 stack 算法构建层级树 */
function buildTree(headings: Heading[]): TreeNode[] {
  const roots: TreeNode[] = [];
  const stack: TreeNode[] = [];

  for (const h of headings) {
    const node: TreeNode = {...h, children: []};
    while (stack.length && stack[stack.length - 1].level >= h.level) {
      stack.pop();
    }
    if (stack.length === 0) {
      roots.push(node);
    } else {
      stack[stack.length - 1].children.push(node);
    }
    stack.push(node);
  }
  return roots;
}

// ────────────── 图标 ──────────────
// inline SVG，避免依赖 Iconfont 字体（编辑器内部用 Iconfont，standalone 不引）
// 全部展开（已展开状态，点击会折叠）— 双箭头朝上
const ICON_COLLAPSE_ALL =
  '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="7 11 12 6 17 11"/><polyline points="7 18 12 13 17 18"/></svg>';
// 全部折叠（已折叠状态，点击会展开）— 双箭头朝下
const ICON_EXPAND_ALL =
  '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="7 13 12 18 17 13"/><polyline points="7 6 12 11 17 6"/></svg>';
// 关闭 X
const ICON_CLOSE =
  '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="6" y1="6" x2="18" y2="18"/><line x1="6" y1="18" x2="18" y2="6"/></svg>';
// 面板恢复（菜单展开图标）
const ICON_MENU_UNFOLD =
  '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="14" y2="12"/><line x1="4" y1="18" x2="18" y2="18"/></svg>';

function setToggleAllIcon(btn: HTMLElement, allExpanded: boolean) {
  // 已展开 → 显示"折叠"图标；已折叠 → 显示"展开"图标
  btn.innerHTML = allExpanded ? ICON_COLLAPSE_ALL : ICON_EXPAND_ALL;
}

// ────────────── DOM 渲染 ──────────────
function makeIconEl(): HTMLSpanElement {
  const span = document.createElement('span');
  span.className = 'toggle-icon';
  span.textContent = '▶';
  return span;
}

function renderNode(
  node: TreeNode,
  state: OutlineState,
): HTMLElement {
  const wrap = document.createElement('div');
  wrap.className = 'textory-tree-node';
  wrap.setAttribute('data-outline-key', node.id);

  const header = document.createElement('div');
  header.className = 'node-header';

  const hasChildren = node.children.length > 0;
  let toggleIcon: HTMLSpanElement | null = null;
  if (hasChildren) {
    toggleIcon = makeIconEl();
    header.appendChild(toggleIcon);
  }

  const label = document.createElement('span');
  label.className = 'node-label';
  label.textContent = node.text;
  header.appendChild(label);

  // 缩进样式按 level 偏移（h1=0, h2=1, ...）
  header.style.paddingLeft = `${Math.max(0, node.level - 1) * 12}px`;

  wrap.appendChild(header);

  // 点击 header：滚动 + flash + setActive
  header.addEventListener('click', (e) => {
    e.stopPropagation();
    handleSelect(node, state);
  });

  // 点击 toggle-icon：展开/折叠（不影响点击跳转）
  if (hasChildren && toggleIcon) {
    toggleIcon.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleNode(wrap, state);
    });
  }

  // 子节点容器
  if (hasChildren) {
    const childrenEl = document.createElement('div');
    childrenEl.className = 'children';
    for (const child of node.children) {
      childrenEl.appendChild(renderNode(child, state));
    }
    wrap.appendChild(childrenEl);
    // 初始展开状态
    if (state.defaultCollapsed && node.level >= 1) {
      // 顶级保留，二级以下默认折叠（与 outline.scss 期望一致）
      // 这里默认全展开，defaultCollapsed 仅控制初始
    }
    if (state.collapsedSet.has(node.id)) {
      wrap.classList.add('is-collapsed');
      childrenEl.style.display = 'none';
    }
  }

  return wrap;
}

function toggleNode(wrap: HTMLElement, state: OutlineState) {
  const key = wrap.getAttribute('data-outline-key') || '';
  const childrenEl = wrap.querySelector(':scope > .children') as HTMLElement | null;
  if (!childrenEl) return;
  const collapsed = wrap.classList.toggle('is-collapsed');
  childrenEl.style.display = collapsed ? 'none' : '';
  if (collapsed) state.collapsedSet.add(key);
  else state.collapsedSet.delete(key);

  // 更新 toggle-all 按钮状态
  state.onToggleChange?.();
}

function handleSelect(node: TreeNode, state: OutlineState) {
  // 滚动
  const target = state.scrollContainer === window
    ? (state.scrollContainer as Window)
    : null;
  const containerEl = state.scrollContainer !== window
    ? (state.scrollContainer as HTMLElement)
    : null;

  const elTop = node.el.getBoundingClientRect().top;
  const thresholdOffset = state.headerOffsetPx;
  let delta: number;
  if (containerEl) {
    const containerRect = containerEl.getBoundingClientRect();
    delta = elTop - containerRect.top - thresholdOffset;
    const target = Math.max(0, containerEl.scrollTop + delta);
    containerEl.scrollTo({top: target, behavior: 'smooth'});
  } else {
    delta = elTop - thresholdOffset;
    const target = Math.max(0, window.scrollY + delta);
    window.scrollTo({top: target, behavior: 'smooth'});
  }

  setActive(node.id, state);
  flash(node.el);
}

function setActive(id: string, state: OutlineState) {
  state.activeKey = id;
  state.mount.querySelectorAll('.node-header.is-active').forEach((el) => {
    el.classList.remove('is-active');
  });
  const node = state.mount.querySelector(
    `[data-outline-key="${cssEscape(id)}"] > .node-header`,
  );
  node?.classList.add('is-active');
}

function flash(el: HTMLElement) {
  el.classList.remove('textory-outline-flash');
  // 强制 reflow 以重启动画
  void el.offsetWidth;
  el.classList.add('textory-outline-flash');
  window.setTimeout(() => {
    el.classList.remove('textory-outline-flash');
  }, 2000);
}

// CSS.escape 兜底
function cssEscape(s: string): string {
  if (typeof CSS !== 'undefined' && typeof CSS.escape === 'function') {
    return CSS.escape(s);
  }
  return s.replace(/(["\\])/g, '\\$1');
}

// ────────────── 内部状态 ──────────────
interface OutlineState {
  scrollContainer: HTMLElement | Window;
  headerOffsetPx: number;
  defaultCollapsed: boolean;
  activeKey: string | null;
  collapsedSet: Set<string>;
  mount: HTMLElement;
  content: HTMLElement;
  flatHeadings: Heading[];
  onToggleChange?: () => void;
  scrollHandler?: () => void;
  resizeHandler?: () => void;
}

// ────────────── 滚动高亮 ──────────────
function computeActive(state: OutlineState) {
  if (state.flatHeadings.length === 0) return;
  let active: Heading | null = null;
  const thresholdOffset = state.headerOffsetPx;
  const viewportTop = state.scrollContainer === window
    ? 0
    : (state.scrollContainer as HTMLElement).getBoundingClientRect().top;
  const threshold = viewportTop + thresholdOffset + 1;

  for (const h of state.flatHeadings) {
    const top = h.el.getBoundingClientRect().top;
    if (top <= threshold) {
      active = h;
    } else {
      break;
    }
  }
  if (!active) active = state.flatHeadings[0];
  if (active) setActive(active.id, state);
}

// ────────────── 公开 API ──────────────
export function create(options: OutlineOptions): OutlineInstance {
  const {
    content,
    mount,
    scrollContainer = window,
    headerOffsetPx = 0,
    defaultCollapsed = false,
  } = options;

  // 清空 mount
  mount.innerHTML = '';

  // 采集 + 建树
  let headings = collectHeadings(content);
  let tree = buildTree(headings);

  const state: OutlineState = {
    scrollContainer,
    headerOffsetPx,
    defaultCollapsed,
    activeKey: null,
    collapsedSet: new Set(),
    mount,
    content,
    flatHeadings: headings,
  };

  // 根容器 .textory-outline
  const panel = document.createElement('div');
  panel.className = 'textory-outline is-show';
  mount.appendChild(panel);

  // toolbar
  const toolbar = document.createElement('div');
  toolbar.className = 'textory-outline-toolbar';
  panel.appendChild(toolbar);

  const toggleAllBtn = document.createElement('span');
  toggleAllBtn.className = 'textory-outline-toggle-all is-expanded';
  toggleAllBtn.title = '展开/折叠全部';
  toggleAllBtn.setAttribute('role', 'button');
  setToggleAllIcon(toggleAllBtn, true);
  toolbar.appendChild(toggleAllBtn);

  // toggle-panel：隐藏面板按钮（X 图标），点击进入 is-collapsed 状态
  const togglePanelBtn = document.createElement('span');
  togglePanelBtn.className = 'textory-outline-toggle-panel';
  togglePanelBtn.title = '隐藏';
  togglePanelBtn.setAttribute('role', 'button');
  togglePanelBtn.innerHTML = ICON_CLOSE;
  toolbar.appendChild(togglePanelBtn);

  // 恢复按钮：仅在 is-collapsed 状态可见，浮动在右侧
  // outline.scss L42 `.textory-outline.is-collapsed .textory-outline-collapsed-trigger`
  // 给 absolute 定位 right:0；panel 自身 overflow:visible 让按钮渲染出 0 宽容器外
  const restoreBtn = document.createElement('span');
  restoreBtn.className =
    'textory-outline-toggle-panel textory-outline-collapsed-trigger';
  restoreBtn.title = '显示大纲';
  restoreBtn.setAttribute('role', 'button');
  restoreBtn.innerHTML = ICON_MENU_UNFOLD;
  restoreBtn.style.display = 'none';
  panel.appendChild(restoreBtn);

  // 面板显示/隐藏状态切换
  let panelCollapsed = false;
  function applyPanelCollapsed(collapsed: boolean) {
    if (collapsed === panelCollapsed) return;
    panelCollapsed = collapsed;
    panel.classList.toggle('is-show', !collapsed);
    panel.classList.toggle('is-collapsed', collapsed);
    toolbar.style.display = collapsed ? 'none' : '';
    treeWrap.style.display = collapsed ? 'none' : '';
    restoreBtn.style.display = collapsed ? '' : 'none';
    options.onCollapsedChange?.(collapsed);
  }

  togglePanelBtn.addEventListener('click', () => applyPanelCollapsed(true));
  restoreBtn.addEventListener('click', () => applyPanelCollapsed(false));

  // tree 容器
  const treeWrap = document.createElement('div');
  treeWrap.className = 'textory-outline-tree';
  panel.appendChild(treeWrap);

  function renderTree() {
    treeWrap.innerHTML = '';
    for (const node of tree) {
      treeWrap.appendChild(renderNode(node, state));
    }
  }
  renderTree();

  // 展开/折叠全部
  function allExpanded(): boolean {
    const collapsedNodes = treeWrap.querySelectorAll('.textory-tree-node.is-collapsed');
    return collapsedNodes.length === 0;
  }
  state.onToggleChange = () => {
    const expanded = allExpanded();
    toggleAllBtn.classList.toggle('is-expanded', expanded);
    setToggleAllIcon(toggleAllBtn, expanded);
  };

  toggleAllBtn.addEventListener('click', () => {
    const shouldCollapse = allExpanded();
    treeWrap.querySelectorAll<HTMLElement>('.textory-tree-node').forEach((wrap) => {
      const childrenEl = wrap.querySelector(':scope > .children') as HTMLElement | null;
      if (!childrenEl) return;
      if (shouldCollapse) {
        wrap.classList.add('is-collapsed');
        childrenEl.style.display = 'none';
        const key = wrap.getAttribute('data-outline-key');
        if (key) state.collapsedSet.add(key);
      } else {
        wrap.classList.remove('is-collapsed');
        childrenEl.style.display = '';
        const key = wrap.getAttribute('data-outline-key');
        if (key) state.collapsedSet.delete(key);
      }
    });
    toggleAllBtn.classList.toggle('is-expanded', !shouldCollapse);
    setToggleAllIcon(toggleAllBtn, !shouldCollapse);
  });

  // 滚动监听
  let rafId: number | null = null;
  state.scrollHandler = () => {
    if (rafId !== null) return;
    rafId = requestAnimationFrame(() => {
      rafId = null;
      computeActive(state);
    });
  };
  (scrollContainer as Window | HTMLElement).addEventListener(
    'scroll',
    state.scrollHandler,
    {passive: true},
  );
  // 初始 active
  computeActive(state);

  // 公开 API
  return {
    destroy() {
      if (state.scrollHandler) {
        (scrollContainer as Window | HTMLElement).removeEventListener(
          'scroll',
          state.scrollHandler,
        );
      }
      mount.innerHTML = '';
    },
    expandAll() {
      treeWrap.querySelectorAll<HTMLElement>('.textory-tree-node').forEach((wrap) => {
        const childrenEl = wrap.querySelector(':scope > .children') as HTMLElement | null;
        if (!childrenEl) return;
        wrap.classList.remove('is-collapsed');
        childrenEl.style.display = '';
      });
      state.collapsedSet.clear();
      toggleAllBtn.classList.add('is-expanded');
      setToggleAllIcon(toggleAllBtn, true);
    },
    collapseAll() {
      treeWrap.querySelectorAll<HTMLElement>('.textory-tree-node').forEach((wrap) => {
        const childrenEl = wrap.querySelector(':scope > .children') as HTMLElement | null;
        if (!childrenEl) return;
        wrap.classList.add('is-collapsed');
        childrenEl.style.display = 'none';
        const key = wrap.getAttribute('data-outline-key');
        if (key) state.collapsedSet.add(key);
      });
      toggleAllBtn.classList.remove('is-expanded');
      setToggleAllIcon(toggleAllBtn, false);
    },
    collapse() {
      applyPanelCollapsed(true);
    },
    expand() {
      applyPanelCollapsed(false);
    },
    isCollapsed() {
      return panelCollapsed;
    },
    refresh() {
      headings = collectHeadings(content);
      tree = buildTree(headings);
      state.flatHeadings = headings;
      renderTree();
      computeActive(state);
    },
  };
}

const TextoryOutline = {create};

export {TextoryOutline};
export default TextoryOutline;
