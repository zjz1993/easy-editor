import {NodeViewContent, NodeViewWrapper} from '@tiptap/react';

export default props => {
  console.log('props是', props);
  return (
    <NodeViewWrapper className="draggable-item easy-editor-block-container">
      <div
        className="drag-handle"
        contentEditable={false}
        draggable="true"
        data-drag-handle
      />
      <NodeViewContent className="content" />
    </NodeViewWrapper>
  );
};
