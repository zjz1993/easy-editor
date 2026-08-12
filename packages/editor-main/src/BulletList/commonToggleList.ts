export function commonToggleList({ props, editor, options, name }) {
  const { tr, commands, chain } = props;
  const { from, to } = tr.selection;

  let childNodeIndent = null;

  tr.doc.nodesBetween(from, to, (node, pos) => {
    if (node.type.name === 'paragraph') {
      childNodeIndent = node.attrs.indent;

      if (props.dispatch) {
        tr.setNodeMarkup(
          pos,
          node.type,
          { ...node.attrs, indent: null },
          node.marks,
        );
      }
    }
  });

  if (options.keepAttributes) {
    const itemTypeName = options.itemTypeName || 'listItem';

    return commands.toggleList(name, itemTypeName, options.keepMarks, {
      indent: childNodeIndent,
    });
  }

  return commands.toggleList(name, options.itemTypeName, options.keepMarks);
}
