import {NodeViewWrapper} from '@tiptap/react';
import type {NodeViewProps} from '@tiptap/core';
import cx from 'classnames';
import {Iconfont, isNull, isViewEditable, Popover, PREVIEW_CLS,} from '@easy-editor/editor-common';
import {type FC, useRef, useState} from 'react';
import type {ImageNodeAttributes} from './ImageNode.ts';
import './index.scss';
import useHandleChangeImageSize from './hooks/useHandleChangeImageSize.ts';

const ImageView: FC<
  NodeViewProps & {
    node: {
      dom: HTMLElement;
      attrs: ImageNodeAttributes;
    };
  }
> = props => {
  const imgRef = useRef<HTMLImageElement>();

  const [imageRatio, setImageRatio] = useState<number | undefined>();
  const { updateAttributes, node, selected, editor, view } = props;
  const { attrs } = node;
  console.log('node是', node);
  const { width, height, src, textAlign = 'left', id } = attrs;
  const containerRef = useRef(null);
  const { handleMouseDown, size } = useHandleChangeImageSize({
    containerRef,
    initWidth: width,
    initHeight: height,
    ratio: imageRatio,
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
      className={cx(
        isNull(textAlign)
          ? 'easy-editor-image-left'
          : `easy-editor-image-${textAlign}`,
        'easy-editor-image-container',
        'easy-editor-block-container',
      )}
      onClick={handleClickImage}
    >
      <span className={cx('easy-editor-image')} data-id={id}>
        <div className={PREVIEW_CLS.FULL_SCREEN}>
          <Iconfont type="icon-enterfs" />
        </div>
        <Popover content={<div>123</div>} triggerAction="hover">
          <img
            onLoad={() => {
              const $image = imgRef.current;
              const checkImageShow = ($image: HTMLImageElement) => {
                return new Promise((resolve, reject) => {
                  if (!$image) {
                    reject();
                  }
                  const checkImageSize = () => {
                    if ($image.clientWidth > 0 && $image.clientHeight > 0) {
                      resolve('');
                    } else {
                      requestAnimationFrame(checkImageSize);
                    }
                  };
                  checkImageSize();
                });
              };
              checkImageShow($image).then(() => {
                const ratio = $image.clientWidth / $image.clientHeight;
                setImageRatio(ratio);
              });
            }}
            ref={imgRef}
            src={src}
            alt=""
            width={size.width}
            height={size.height}
          />
        </Popover>
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
      </span>
    </NodeViewWrapper>
  );
};
export default ImageView;
