export function commonToggleList({ props, editor, options, name }) {
  const { tr, commands, chain } = props;
  const { from, to } = tr.selection;

  let childNodeIndent = null;

  // 遍历时不要 dispatch
  tr.doc.nodesBetween(from, to, (node, pos) => {
    if (node.type.name === 'paragraph') {
      childNodeIndent = node.attrs.indent;

      // ✔ 累积到同一个 tr 上
      tr.setNodeMarkup(
        pos,
        node.type,
        { ...node.attrs, indent: null },
        node.marks,
      );
    }
  });

  // ✔ 遍历完后一次性 dispatch
  props.dispatch?.(tr);

  if (options.keepAttributes) {
    return chain()
      .toggleList(name, options.itemTypeName, options.keepMarks, {
        indent: childNodeIndent,
      })
      .updateAttributes('listItem', editor.getAttributes('textStyle'))
      .run();
  }

  return commands.toggleList(name, options.itemTypeName, options.keepMarks);
}
