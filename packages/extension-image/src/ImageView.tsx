import {NodeViewWrapper} from '@tiptap/react';
import type {NodeViewProps} from '@tiptap/core';
import cx from 'classnames';
import {Iconfont, isUndefined, isViewEditable, Popover, PREVIEW_CLS,} from '@easy-editor/editor-common';
import {type FC, useEffect, useRef, useState} from 'react';
import type {ImageNodeAttributes} from './ImageNode.ts';
import './index.scss';
import useHandleChangeImageSize from './hooks/useHandleChangeImageSize.ts';
import ImageNodeToolbar from './ImageNodeToolbar.tsx';

const fileToObjectUrl = (file: Blob | MediaSource) => {
  const url = window.URL || window.webkitURL;
  return url.createObjectURL(file);
};
const getProgressCircleProps = (value: number) => {
  const onePercentDeg = 360 / 100;
  const rightRotateDeg = value <= 50 ? onePercentDeg * value : 180;
  const leftRotateDeg = value > 50 ? onePercentDeg * (value - 50) : 0;
  const beginDeg = -45;
  const rightAnimationCls = value > 50 ? '' : 'has-animation';
  return {
    leftRotateDeg: beginDeg + leftRotateDeg,
    rightRotateDeg: beginDeg + rightRotateDeg,
    rightAnimationCls: rightAnimationCls,
  };
};

const ImageView: FC<
  NodeViewProps & {
    node: {
      dom: HTMLElement;
      attrs: ImageNodeAttributes;
    };
  }
> = props => {
  const imgRef = useRef<HTMLImageElement>();
  const popoverRef = useRef<any>();
  const [imageRatio, setImageRatio] = useState<number | undefined>();
  const { updateAttributes, node, selected, editor, view, getPos } = props;
  const { attrs } = node;
  const {
    width,
    height,
    src,
    textAlign,
    id,
    hasBorder,
    loading,
    loadingProgress,
    tempFile,
  } = attrs;
  const containerRef = useRef(null);
  const { handleMouseDown, size, changeSize } = useHandleChangeImageSize({
    containerRef,
    initWidth: width,
    initHeight: height,
    ratio: imageRatio,
    onResizeEnd: data => {
      console.log('拖动完成的data是', data);
      updateAttributes(data);
    },
  });
  const handleClickImage = () => {
    // 如果需要手动触发选中状态，可以使用 editor 的命令
    const pos = getPos();
    editor.chain().setNodeSelection(pos).run(); // 手动选中节点
  };
  const handleRemove = () => {
    const imagePos = getPos();
    const tr = view.state.tr;
    tr.delete(imagePos, imagePos + 1);
    view.dispatch(tr);
    view.focus();
  };
  useEffect(() => {
    const editorDom = editor.view.dom;

    const handleDragOver = (event: DragEvent) => {
      event.preventDefault();
    };

    const handleDrop = (event: DragEvent) => {
      const pos = editor.view.posAtCoords({
        left: event.clientX,
        top: event.clientY,
      });

      const currentPos = getPos?.();
      if (!pos || typeof currentPos !== 'number') return;

      event.preventDefault();

      const insertPos = pos.pos > currentPos ? pos.pos - 1 : pos.pos;

      const tr = editor.view.state.tr
        .delete(currentPos, currentPos + 1)
        .insert(insertPos, node);

      editor.view.dispatch(tr);
    };

    editorDom.addEventListener('dragover', handleDragOver);
    editorDom.addEventListener('drop', handleDrop);

    return () => {
      editorDom.removeEventListener('dragover', handleDragOver);
      editorDom.removeEventListener('drop', handleDrop);
    };
  }, [editor, getPos, node]);
  const getProgressCircleHTML = (value: number) => {
    const { leftRotateDeg, rightRotateDeg, rightAnimationCls } =
      getProgressCircleProps(value);
    return (
      <div className="circle">
        <div className="circle-left">
          <div
            className="inner"
            style={{ transform: `rotate(${leftRotateDeg}deg)` }}
          ></div>
        </div>
        <div className="circle-right">
          <div
            className={cx('inner', rightAnimationCls)}
            style={{ transform: `rotate(${rightRotateDeg}deg)` }}
          ></div>
        </div>
        <div className="circle-text">{Number.parseInt(String(value), 10)}%</div>
      </div>
    );
  };
  return (
    <NodeViewWrapper
      draggable="true"
      ref={containerRef}
      className={cx(
        `easy-editor-image-${textAlign}`,
        'easy-editor-image-container',
        'easy-editor-block-container',
      )}
      as="div"
      onClick={handleClickImage}
    >
      <span
        className={cx(
          'easy-editor-image',
          !loading && !tempFile && 'easy-editor-image-normal',
          hasBorder && 'easy-editor-image-border',
        )}
        data-id={id}
      >
        <div className={PREVIEW_CLS.FULL_SCREEN}>
          <Iconfont type="icon-enterfs" />
        </div>
        {loading && tempFile && !isUndefined(loadingProgress) ? (
          <>
            <div className="easy-editor-image__placeholder">
              {getProgressCircleHTML(loadingProgress)}
            </div>
            <img src={fileToObjectUrl(tempFile)} />
          </>
        ) : (
          <Popover
            ref={popoverRef}
            content={
              <ImageNodeToolbar
                onAlignChange={align => {
                  updateAttributes({ textAlign: align });
                  // popoverRef.current.update();
                }}
                align={textAlign}
                hasBorder={hasBorder}
                defaultWidth={width}
                onRemove={handleRemove}
                onBorder={() => {
                  updateAttributes({ hasBorder: !hasBorder });
                }}
                onWidthChange={value => {
                  if (imageRatio) {
                    const newHeight = value / imageRatio;
                    changeSize(value, newHeight);
                    updateAttributes({ width: value, height: newHeight });
                  }
                }}
              />
            }
            triggerAction="hover"
          >
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
              draggable={false} // 禁止原生拖动
            />
          </Popover>
        )}
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
