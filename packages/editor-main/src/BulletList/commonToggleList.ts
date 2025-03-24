import { BLOCK_TYPES } from '@easy-editor/editor-common';
import type { CommandProps } from '@tiptap/react';
import { ListItem } from './list-item';
import { TextStyle } from './text-style';

export function commonToggleList({
  props,
  editor,
  options,
  name,
}: {
  props: CommandProps;
  editor: any;
  options: Record<any, any>;
  name: string;
}) {
  const { dispatch, tr, commands, chain } = props;
  const { selection } = tr;
  const { from, to } = selection;
  let childNodeIndent = null;
  tr.doc.nodesBetween(from, to, (node: any, pos: number) => {
    const { P } = BLOCK_TYPES;
    if (node.type.name === P) {
      const indent = node.attrs.indent;
      childNodeIndent = indent;
      // 去除原来p节点上的缩进
      const newTr = tr.setNodeMarkup(
        pos,
        node.type,
        { indent: null },
        node.marks,
      );
      dispatch?.(newTr);
    }
  });

  if (options.keepAttributes) {
    return chain()
      .toggleList(name, options.itemTypeName, options.keepMarks, {
        indent: childNodeIndent,
      })
      .updateAttributes(ListItem.name, editor.getAttributes(TextStyle.name))
      .run();
  }
  return commands.toggleList(name, options.itemTypeName, options.keepMarks);
}
