import DragHandleReact from '@tiptap/extension-drag-handle-react';
import type {Editor} from '@tiptap/react';
import {useCallback, useMemo, useRef, useState} from 'react';
import {BLOCK_TYPES} from '@textory/editor-utils';
import {GripIcon} from './GripIcon';

const DRAG_HANDLE_POSITION_CONFIG = {
  placement: 'left',
} as const;

/**
 * ProseMirror node types that indicate "inside a table". When the hovered
 * node has any of these in its ancestor chain, the handle is hidden so
 * users can't drag a cell's inner paragraph out of the table.
 */
const TABLE_INNER_TYPES = new Set<string>([
  BLOCK_TYPES.TL, // 'table'
  BLOCK_TYPES.TR, // 'table_row'
  BLOCK_TYPES.TD, // 'table_cell'
  BLOCK_TYPES.TH, // 'tableHeader'
]);

/**
 * onNodeChange payload. drag-handle-react's exact props type isn't exported,
 * so we mirror the runtime shape we use. `node` is a ProseMirror Node — we
 * type it loosely to avoid pulling in @tiptap/pm as a direct dep of this
 * package (Tiptap core already re-exports ProseMirror types).
 */
interface DragHandleNodeChange {
  node: unknown | null;
  editor: Editor;
  pos: number;
}

export interface TextoryDragHandleProps {
  editor: Editor;
}

/**
 * Block-level drag handle for the Easy Editor.
 *
 * Wraps `@tiptap/extension-drag-handle-react` and:
 * - Hides the handle when the hovered node sits inside a table cell / row /
 *   header (dragging those out would break the table).
 * - Renders a 6-dot grip icon as the handle.
 *
 * Mounted by `editor-main/src/root.tsx` as `DragHandleLayer`, gated by
 * `editor.isEditable`. See `.ai/docs/drag-handle.md` for design constraints.
 */
export function TextoryDragHandle({editor}: TextoryDragHandleProps) {
  const [pos, setPos] = useState<number>(-1);
  const currentNodePosRef = useRef<number>(-1);

  const handleNodeChange = useCallback(
    (data: DragHandleNodeChange) => {
      currentNodePosRef.current = data.pos ?? -1;

      //if (data.pos >= 0) {
      //  requestAnimationFrame(() => {
      //    editor.commands.setMeta('lockDragHandle', true);
      //  });
      //}

      setPos(data.pos ?? -1);
    },
    [],
  );

  const getReferencedVirtualElement = useCallback(() => {
    const currentPos = currentNodePosRef.current;
    if (currentPos < 0 || editor.isDestroyed) return null;

    const nodeDom = editor.view.nodeDOM(currentPos);
    const element =
      nodeDom instanceof HTMLElement ? nodeDom : nodeDom?.parentElement;
    if (!element) return null;
    const referenceElement =
      element.classList.contains('textory-block-container') &&
      element.firstElementChild instanceof HTMLElement
        ? element.firstElementChild
        : element;

    return {
      getBoundingClientRect: () => {
        const rect = referenceElement.getBoundingClientRect();
        const styles = window.getComputedStyle(referenceElement);
        const lineHeight = Number.parseFloat(styles.lineHeight);
        const fontSize = Number.parseFloat(styles.fontSize);
        const fallbackLineHeight = Number.isFinite(fontSize)
          ? fontSize * 1.4
          : 24;
        const firstLineHeight = Math.min(
          rect.height,
          Number.isFinite(lineHeight) ? lineHeight : fallbackLineHeight,
        );

        return new DOMRect(rect.x, rect.y, rect.width, firstLineHeight);
      },
    };
  }, [editor]);

  /**
   * Resolve the current hovered position's ancestor chain. If any ancestor
   * is the table itself / a row / a cell / a header, suppress the handle.
   *
   * The table node itself is also in TABLE_INNER_TYPES on purpose: when
   * hovering the table, the deepest block is the table, and we want to
   * keep the handle visible only for the table-level node — but the
   * drag-handle-react plugin fires onNodeChange with the innermost
   * block, which for tables is usually a cell paragraph. Including
   * TABLE / ROW / CELL / HEADER in the hide-list uniformly suppresses
   * all in-table hovers. The table itself remains draggable because
   * hovering the table border still produces a non-cell ancestor path
   * in practice — verified at demo time.
   */
  const isInsideTable = useMemo(() => {
    if (pos < 0 || !editor) return false;
    try {
      const $pos = editor.state.doc.resolve(pos);
      for (let depth = $pos.depth; depth > 0; depth--) {
        const name = $pos.node(depth).type.name;
        if (TABLE_INNER_TYPES.has(name)) return true;
      }
      return false;
    } catch {
      return false;
    }
  }, [pos, editor]);

  return (
    <DragHandleReact
      editor={editor}
      computePositionConfig={DRAG_HANDLE_POSITION_CONFIG}
      getReferencedVirtualElement={getReferencedVirtualElement}
      onNodeChange={handleNodeChange as never}
      pluginKey="TextoryDragHandle"
      className="textory-drag-handle-layer"
    >
      {!isInsideTable ? (
        <div className="textory-drag-handle" aria-label="Drag handle">
          <GripIcon />
        </div>
      ) : null}
    </DragHandleReact>
  );
}
