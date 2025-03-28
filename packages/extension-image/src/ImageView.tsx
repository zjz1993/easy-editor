import {NodeViewWrapper} from '@tiptap/react';
import type {NodeViewProps} from '@tiptap/core';
import {type FC, useRef} from 'react';
import type {ImageNodeAttributes} from './ImageNode.ts';
import './index.scss';
import useHandleChangeImageSize from './hooks/useHandleChangeImageSize.ts';
import {isViewEditable} from '@easy-editor/editor-common/src/index.ts';

const ImageView: FC<
  NodeViewProps & {
    node: {
      dom: HTMLElement;
      attrs: ImageNodeAttributes;
    };
  }
> = props => {
  const { updateAttributes, node, selected, editor, view } = props;
  const { attrs } = node;
  const { width, height, src } = attrs;
  const containerRef = useRef(null);
  const { handleMouseDown, size } = useHandleChangeImageSize({
    containerRef,
    initWidth: width,
    initHeight: height,
    onResizeEnd: data => updateAttributes(data),
  });
  const handleClickImage = () => {
    // 点击时检查节点是否被选中
    console.log('节点是否被选中:', selected);

    // 如果需要手动触发选中状态，可以使用 editor 的命令
    const pos = editor.view.posAtDOM(node.dom as HTMLElement, 0);
    editor.chain().setNodeSelection(pos).run(); // 手动选中节点
  };
  return (
    <NodeViewWrapper
      ref={containerRef}
      className="easy-editor-image-container"
      onClick={handleClickImage}
    >
      <img src={src} alt="" width={size.width} height={size.height} />
      {selected && isViewEditable(view) && (
        <>
          <div
            className="top-left easy-editor-image__resize-handle"
            onMouseDown={e => handleMouseDown(e, 'top-left')}
          />
          <div
            className="top-right easy-editor-image__resize-handle"
            onMouseDown={e => handleMouseDown(e, 'top-right')}
          />
          <div
            className="bottom-left easy-editor-image__resize-handle"
            onMouseDown={e => handleMouseDown(e, 'bottom-left')}
          />
          <div
            className="bottom-right easy-editor-image__resize-handle"
            onMouseDown={e => handleMouseDown(e, 'bottom-right')}
          />
        </>
      )}
    </NodeViewWrapper>
  );
};
export default ImageView;
