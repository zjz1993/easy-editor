// OutlineView.tsx
import {useEffect, useMemo, useRef, useState} from 'react';
import type {Editor} from '@tiptap/core';
import {Tooltip, Iconfont, IntlComponent} from '@textory/editor-common';
import {flashPluginKey} from './OutlineExtension';
import Tree from './components/Tree';
import type {TreeNodeProps} from './components/Tree/type';

/** Padding (px) below the scroll container's top edge where a heading is considered "passed". */
const HEADER_OFFSET_PX = 20;

/** Flattened outline item carrying the heading's ProseMirror position and parent id. */
interface FlatItem {
  id: string;
  pos: number;
  parentId: string | null;
}

/**
 * Locate the DOM element of a heading given its ProseMirror position.
 * Returns null if the heading is no longer in the DOM (deleted/unmounted).
 *
 * `pos` points to the start of the heading node itself. When the heading is
 * wrapped (e.g. by `wrapBlockExtensions` -> `.textory-block-container`), the
 * DOM node at `pos` is the outer wrapper, and the actual `<hN>` sits inside
 * it as a descendant. We therefore probe `pos + 1` (which lands inside the
 * heading content) and walk up, with a walk-down fallback for safety.
 */
function getHeadingEl(editor: Editor, pos: number): HTMLElement | null {
  const selector = 'h1,h2,h3,h4,h5,h6';
  const dom = editor.view.dom;
  const isUsable = (el: HTMLElement | null): el is HTMLElement =>
    !!el && dom.contains(el);

  try {
    const result = editor.view.domAtPos(pos + 1);
    const node = result.node as Node;
    const el: HTMLElement | null =
      node.nodeType === Node.TEXT_NODE
        ? (node.parentElement as HTMLElement | null)
        : (node as HTMLElement | null);
    if (!el) return null;

    const up = el.closest<HTMLElement>(selector);
    if (isUsable(up)) return up;

    const down = el.querySelector<HTMLElement>(selector);
    if (isUsable(down)) return down;

    return null;
  } catch {
    return null;
  }
}

/** Flatten the tree into a document-order list with parent pointers. */
function flatten(
  items: TreeNodeProps[],
  parentId: string | null = null,
): FlatItem[] {
  const result: FlatItem[] = [];
  for (const item of items) {
    const id = item.id;
    result.push({id, pos: Number(id), parentId});
    if (item.children && item.children.length > 0) {
      result.push(...flatten(item.children, id));
    }
  }
  return result;
}

/** Collect ids of every node that has children (i.e. is expandable). */
function collectExpandableIds(nodes: TreeNodeProps[]): string[] {
  const ids: string[] = [];
  const walk = (list: TreeNodeProps[]) => {
    for (const n of list) {
      if (n.children && n.children.length > 0) {
        ids.push(n.id);
        walk(n.children);
      }
    }
  };
  walk(nodes);
  return ids;
}

/** Walk up from `id` to collect all ancestor ids (excluding self). */
function getAncestorIds(id: string, flat: FlatItem[]): string[] {
  const ancestors: string[] = [];
  const byId = new Map(flat.map(i => [i.id, i]));
  let current = byId.get(id);
  while (current?.parentId) {
    ancestors.push(current.parentId);
    current = byId.get(current.parentId);
  }
  return ancestors;
}

/**
 * Find the editor's scroll container. `.textory-body` is the element that
 * owns `overflow: auto` in the editor layout (see root.scss); we look it up
 * from the editor DOM so this works regardless of where the OutlineView is
 * mounted (inside or beside `<EditorContent>`).
 */
function getEditorScrollContainer(editor: Editor): HTMLElement | null {
  return editor.view.dom.closest('.textory-body') as HTMLElement | null;
}

/**
 * Scroll `container` just enough to bring `el` into view, WITHOUT touching
 * any ancestor of `container`. This replaces `el.scrollIntoView`, which would
 * also scroll `.textory-body` and could cancel the smooth scroll triggered
 * by `handleSelect` (because `setActiveKey` re-renders and re-runs the
 * active-key effect while the heading smooth-scroll is still in flight).
 */
function scrollInsideContainer(el: HTMLElement, container: HTMLElement) {
  const elRect = el.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();
  const margin = 8;
  if (elRect.top < containerRect.top) {
    container.scrollBy({
      top: elRect.top - containerRect.top - margin,
      behavior: 'smooth',
    });
  } else if (elRect.bottom > containerRect.bottom) {
    container.scrollBy({
      top: elRect.bottom - containerRect.bottom + margin,
      behavior: 'smooth',
    });
  }
}

/**
 * Briefly pulse a heading's background so the user sees which heading they
 * jumped to after clicking an outline node.
 *
 * Instead of toggling a DOM class directly (which ProseMirror's DOMObserver
 * immediately strips during reconciliation), we drive the flash through a
 * ProseMirror plugin that manages a `Decoration.node` decoration. ProseMirror
 * treats decorations as part of its own state, so the class survives.
 *
 * Restart-safe: each call first clears any active decoration, then re-adds
 * it on the next animation frame so the browser registers the remove → add
 * transition and replays the CSS animation.
 */
let flashRafId: number | null = null;
let flashTimeoutId: number | null = null;

function flashHeading(editor: Editor, pos: number) {
  // Cancel any pending flash cycle so rapid re-clicks don't overlap.
  if (flashRafId !== null) cancelAnimationFrame(flashRafId);
  if (flashTimeoutId !== null) clearTimeout(flashTimeoutId);

  // Remove any existing decoration so the CSS animation restarts on re-click.
  editor.view.dispatch(
    editor.state.tr.setMeta(flashPluginKey, {action: 'clear'}),
  );

  // Add the decoration on the next frame so the browser sees the class go
  // from absent → present and actually replays the animation.
  flashRafId = requestAnimationFrame(() => {
    flashRafId = null;
    const state = editor.view.state;
    const node = state.doc.nodeAt(pos);
    if (!node) return;
    editor.view.dispatch(
      state.tr.setMeta(flashPluginKey, {action: 'flash', pos}),
    );

    // Clear after the animation finishes (0.6s × 3 iterations = 1.8s).
    flashTimeoutId = window.setTimeout(() => {
      flashTimeoutId = null;
      editor.view.dispatch(
        editor.state.tr.setMeta(flashPluginKey, {action: 'clear'}),
      );
    }, 2000);
  });
}

interface OutlineViewProps {
  editor: Editor | null;
}

export const OutlineView = ({editor}: OutlineViewProps) => {
  const [treeData, setTreeData] = useState<TreeNodeProps[]>([]);
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set());
  const [collapsed, setCollapsed] = useState(false);

  // Refs that survive re-renders and are readable inside event handlers.
  const flatRef = useRef<FlatItem[]>([]);
  const outlineRootRef = useRef<HTMLDivElement | null>(null);

  const convertOutlineToTree = (items: any[]): TreeNodeProps[] =>
    items.map(i => ({
      id: String(i.pos),
      label: i.text,
      children: convertOutlineToTree(i.children || []),
    }));

  // Effect 1 — subscribe to editor updates; keep treeData + flatRef fresh;
  // attach scroll/resize listeners; compute active heading on any of these triggers.
  useEffect(() => {
    if (!editor) return;
    const container = getEditorScrollContainer(editor);
    if (!container) return;

    let ticking = false;
    let rafId: number | null = null;

    const compute = () => {
      ticking = false;
      const flat = flatRef.current;
      if (flat.length === 0) return;
      const containerRect = container.getBoundingClientRect();
      const threshold = containerRect.top + HEADER_OFFSET_PX;
      let active: FlatItem | null = null;
      for (const item of flat) {
        const el = getHeadingEl(editor, item.pos);
        if (!el) continue;
        const top = el.getBoundingClientRect().top;
        if (top <= threshold) {
          active = item;
        } else {
          break;
        }
      }
      if (!active) active = flat[0];
      setActiveKey(active.id);
    };

    const scheduleCompute = () => {
      if (ticking) return;
      ticking = true;
      rafId = requestAnimationFrame(compute);
    };

    const syncData = () => {
      const outline = (editor.storage as any).outline?.outline ?? [];
      const newTree = convertOutlineToTree(outline);
      flatRef.current = flatten(newTree);
      setTreeData(newTree);
      scheduleCompute();
    };

    // Initial
    syncData();

    // Listeners
    container.addEventListener('scroll', scheduleCompute, {passive: true});
    window.addEventListener('resize', scheduleCompute);
    editor.on('update', syncData);

    return () => {
      container.removeEventListener('scroll', scheduleCompute);
      window.removeEventListener('resize', scheduleCompute);
      editor.off('update', syncData);
      if (rafId !== null) cancelAnimationFrame(rafId);
      ticking = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor]);

  // Effect 2 — auto-expand ancestors of the active heading so the highlight is always visible.
  useEffect(() => {
    if (!activeKey) return;
    const ancestors = getAncestorIds(activeKey, flatRef.current);
    if (ancestors.length === 0) return;
    setExpandedKeys(prev => {
      if (ancestors.every(a => prev.has(a))) return prev;
      const next = new Set(prev);
      ancestors.forEach(a => next.add(a));
      return next;
    });
  }, [activeKey]);

  // Effect 3 — keep the active tree node visible inside the outline panel.
  // NOTE: scoped to `.textory-outline` only. Calling `el.scrollIntoView` here
  // would also scroll `.textory-body` (its scrollable ancestor) and cancel the
  // smooth scroll that `handleSelect` just triggered on the editor body.
  useEffect(() => {
    if (!activeKey || !outlineRootRef.current) return;
    const el = outlineRootRef.current.querySelector(
      `[data-outline-key="${activeKey}"]`,
    ) as HTMLElement | null;
    if (!el) return;
    scrollInsideContainer(el, outlineRootRef.current);
  }, [activeKey]);

  const handleSelect = (id: string) => {
    if (!editor) return;
    const pos = Number(id);
    if (Number.isNaN(pos)) return;

    // Optimistic update so highlight doesn't flicker during smooth scroll.
    setActiveKey(id);

    // Flash the heading via a ProseMirror decoration (survives DOMObserver).
    flashHeading(editor, pos);

    // Scroll the heading into view.
    const el = getHeadingEl(editor, pos);
    if (!el) return;
    const container = getEditorScrollContainer(editor);
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    const delta = elRect.top - containerRect.top - HEADER_OFFSET_PX;
    const target = Math.max(0, container.scrollTop + delta);
    container.scrollTo({top: target, behavior: 'smooth'});
  };

  const handleToggle = (id: string) => {
    setExpandedKeys(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const expandableIds = useMemo(
    () => collectExpandableIds(treeData),
    [treeData],
  );
  const allExpanded =
    expandableIds.length > 0 &&
    expandableIds.every(id => expandedKeys.has(id));

  const handleToggleAll = () => {
    setExpandedKeys(
      allExpanded ? new Set<string>() : new Set(expandableIds),
    );
  };

  if (treeData.length === 0) {
    return null;
  }

  if (collapsed) {
    return (
      <div className="textory-outline is-collapsed" ref={outlineRootRef}>
        <Tooltip
          content={IntlComponent.get('outline.show')}
          placement="left"
          className="textory-outline-collapsed-trigger"
        >
          <Iconfont
            type='icon-menu-fold'
            className="textory-outline-toggle-panel"
            onClick={() => setCollapsed(false)}
          />
        </Tooltip>
      </div>
    );
  }

  return (
    <div className="textory-outline" ref={outlineRootRef}>
      <div className="textory-outline-toolbar">
        {expandableIds.length > 0 && (
          <Tooltip
            content={allExpanded ? '全部收起' : '全部展开'}
            placement="left"
          >
            <Iconfont
              className={`textory-outline-toggle-all${
                allExpanded ? ' is-expanded' : ''
              }`}
              onClick={handleToggleAll}
              type={!allExpanded ? 'zhedie' : 'zhankai'}
            />
          </Tooltip>
        )}
        <Tooltip content={IntlComponent.get('outline.hide')} placement="left">
          <Iconfont
            type="close"
            className="textory-outline-toggle-panel"
            onClick={() => setCollapsed(true)}
          >
          </Iconfont>
        </Tooltip>
      </div>
      <Tree
        data={treeData}
        activeKey={activeKey}
        expandedKeys={expandedKeys}
        onSelect={handleSelect}
        onToggle={handleToggle}
      />
    </div>
  );
};
