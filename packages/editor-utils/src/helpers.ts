import type {EditorState} from '@tiptap/pm/state';
import {isTextSelection} from "@tiptap/core";
import {NodeSelection} from '@tiptap/pm/state';
import { Node, NodeType } from '@tiptap/pm/model';
import {isString} from "lodash-es";
import {BLOCK_TYPES} from './constants';
export function isInTable(state: EditorState): boolean {
  const $head = state.selection.$head;
  for (let d = $head.depth; d > 0; d--)
    if ($head.node(d).type.spec.tableRole === 'row') return true;
  return false;
}
export const isNodeSelection = (selection) => {
  return selection instanceof NodeSelection;
};
const judgeNodeType = (types) => {
  return (node: unknown) => {
    if (node instanceof Node) {
      return types.includes(node.type.name);
    }
    if (node instanceof NodeType) {
      return types.includes(node.name);
    }
    if (isString(node)) {
      return types.includes(node);
    }
    return false;
  };
};
export const isListNode = judgeNodeType([
  BLOCK_TYPES.UL,
  BLOCK_TYPES.OL,
  BLOCK_TYPES.CL,
]);
export const isInListSelection = (state) => {
  const { selection } = state;

  if (isTextSelection(selection) && selection.$cursor) {
    for (let depth = 0; depth < selection.$cursor.depth; depth++) {
      if (isListNode(selection.$cursor.node(depth))) {
        return true;
      }
    }
    return false;
  }

  const { from, to } = selection;
  let hasListNode = false;
  state.doc.nodesBetween(from, to, (node, pos) => {
    if (isListNode(node) && (from > pos || to < pos + node.nodeSize)) {
      hasListNode = true;
    }
  });
  return hasListNode;
};
