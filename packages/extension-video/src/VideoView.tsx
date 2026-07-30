import {NodeViewWrapper, useEditorState} from '@tiptap/react';
import type {NodeViewProps} from '@tiptap/core';
import cx from 'classnames';
import {isViewEditable} from '@textory/editor-utils';
import {Popover} from '@textory/editor-common';
import {type FC, useEffect, useRef, useState} from 'react';
import {isEmpty, isNil} from 'lodash-es';
import useHandleChangeVideoSize from './hooks/useHandleChangeVideoSize.ts';
import VideoNodeToolbar from './VideoNodeToolbar.tsx';
import {uploadPluginKey} from '@textory/extension-upload';
import VideoErrorView from './VideoErrorView.tsx';

/**
 * Shared progress-ring math. Same as ImageView / FileView — kept inline
 * here rather than imported to avoid a cross-package UI dependency. If
 * a fourth caller appears, lift into `@textory/extension-upload` or
 * `@textory/editor-common`.
 */
const getProgressCircleProp = (value: number) => {
  const onePercentDeg = 360 / 100;
  const rightRotateDeg = value <= 50 ? onePercentDeg * value : 180;
  const leftRotateDeg = value > 50 ? onePercentDeg * (value - 50) : 0;
  const beginDeg = -45;
  const rightAnimationCls = value > 50 ? '' : 'has-animation';
  return {
    leftRotateDeg: beginDeg + leftRotateDeg,
    rightRotateDeg: beginDeg + rightRotateDeg,
    rightAnimationCls,
  };
};

const VideoView: FC<NodeViewProps> = props => {
  const videoRef = useRef<HTMLVideoElement>();
  const popoverRef = useRef<any>();
  const [videoRatio, setVideoRatio] = useState<number | undefined>();
  const {updateAttributes, node, selected, editor, view, getPos} = props;
  const {attrs} = node;
  const {
    width,
    height,
    src,
    poster,
    textAlign,
    id,
    uploadKey,
    isError,
  } = attrs;
  // Pick which error message to surface when `isError` is set. Network
  // URLs (http/https) reach this view via the "insert network video"
  // flow — if they fail to play, the message should say so, not claim
  // an upload failure. Anything else (cleared src after upload error,
  // blob URLs, etc.) keeps the legacy upload-failure wording.
  const isNetworkSrc = typeof src === 'string' && /^https?:\/\//i.test(src);
  const errorMessageKey = isNetworkSrc
    ? 'video.playback.failed'
    : 'video.upload.failed';
  const containerRef = useRef(null);

  const {handleMouseDown, size, changeSize} = useHandleChangeVideoSize({
    containerRef,
    initWidth: width,
    initHeight: height,
    ratio: videoRatio,
    onResizeEnd: data => {
      updateAttributes(data);
    },
  });

  const handleClickVideo = () => {
    if (isError) return;
    const pos = getPos();
    editor.chain().setNodeSelection(pos).run();
  };

  const handleRemove = () => {
    const pos = getPos();
    if (typeof pos !== 'number') return;
    const tr = view.state.tr.delete(pos, pos + 1);
    view.dispatch(tr);
    view.focus();
  };

  /**
   * Re-enable native drag-and-drop of the node within the editor.
   * Same approach as ImageView — listen on editor.view.dom and re-insert
   * the node at the drop position.
   */
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

  const progress = useEditorState({
    editor,
    selector: ({editor}) => {
      const pluginState = uploadPluginKey.getState(editor.state);
      const map = pluginState?.progressMap;
      if (!map || isEmpty(map)) return undefined;
      return uploadKey ? (map[uploadKey] ?? 0) : (map[id] ?? 0);
    },
  });

  const getProgressCircleHTML = (value: number) => {
    const {leftRotateDeg, rightRotateDeg, rightAnimationCls} =
      getProgressCircleProp(value);
    return (
      <div className="circle">
        <div className="circle-left">
          <div
            className="inner"
            style={{transform: `rotate(${leftRotateDeg}deg)`}}
          />
        </div>
        <div className="circle-right">
          <div
            className={cx('inner', rightAnimationCls)}
            style={{transform: `rotate(${rightRotateDeg}deg)`}}
          />
        </div>
        <div className="circle-text">
          {Number.parseInt(String(value), 10)}%
        </div>
      </div>
    );
  };

  const renderMedia = () => {
    // No src yet (e.g. network-video flow before URL submitted, or
    // upload error cleared the src). Show empty placeholder.
    if (!src) {
      return (
        <div className="textory-video__placeholder textory-video__placeholder--empty" />
      );
    }
    // Uploading local file: progress ring overlays a hidden video that
    // preloads metadata so size sync can fire as soon as it's ready.
    if (!isNil(progress)) {
      return (
        <>
          <div className="textory-video__placeholder">
            {getProgressCircleHTML(progress)}
          </div>
          {/* biome-ignore lint/a11y/useMediaCaption: <explanation> */}
          <video
            ref={videoRef}
            src={src}
            poster={poster || undefined}
            controls
            onLoadedMetadata={() => {
              const v = videoRef.current;
              if (!v) return;
              if (v.videoWidth && v.videoHeight) {
                setVideoRatio(v.videoWidth / v.videoHeight);
                if (!node.attrs.width) {
                  updateAttributes({
                    width: v.clientWidth,
                    height: v.clientHeight,
                  });
                }
              }
            }}
            style={{visibility: 'hidden', position: 'absolute'}}
          />
        </>
      );
    }
    // Ready (uploaded file, network URL, or local blob): render video
    // with hover toolbar.
    return (
      <Popover
        disabled={!editor.isEditable}
        ref={popoverRef}
        content={
          <VideoNodeToolbar
            onAlignChange={align => updateAttributes({textAlign: align})}
            align={textAlign}
            defaultWidth={width}
            onRemove={handleRemove}
            onWidthChange={value => {
              if (videoRatio) {
                const newHeight = value / videoRatio;
                changeSize(value, newHeight);
                updateAttributes({width: value, height: newHeight});
              } else {
                updateAttributes({width: value});
              }
            }}
          />
        }
        triggerAction="hover"
      >
        {/* biome-ignore lint/a11y/useMediaCaption: <explanation> */}
        <video
          ref={videoRef}
          src={src}
          poster={poster || undefined}
          controls
          onLoadedMetadata={() => {
            const v = videoRef.current;
            if (!v) return;
            if (v.videoWidth && v.videoHeight) {
              setVideoRatio(v.videoWidth / v.videoHeight);
              // 首次加载时 width/height 还是 null，把渲染像素值回写
              // 进 attrs，让工具栏的宽度输入框拿到真实数值（对齐 image）。
              if (!node.attrs.width) {
                updateAttributes({
                  width: v.clientWidth,
                  height: v.clientHeight,
                });
              }
            }
          }}
          onError={() => {
            // Browser fires this on 404/CORS/unsupported-MIME/dead
            // link. Flip the node into error state so VideoErrorView
            // replaces the broken <video>. Guard against re-entry: once
            // isError is true the element is unmounted so this won't
            // loop, but a noisy src (e.g. retry attempts) could spam
            // transactions without the check.
            console.log('onError触发');
            if (!isError) updateAttributes({isError: true});
          }}
          style={{
            width: size.width || '100%',
            height: size.height || 'auto',
          }}
        />
      </Popover>
    );
  };

  return (
    <NodeViewWrapper
      draggable="true"
      ref={containerRef}
      className={cx(
        `textory-video-${textAlign}`,
        'textory-video-container',
        'textory-block-container',
      )}
      as="div"
      onClick={handleClickVideo}
    >
      <span
        className={cx(
          'textory-video',
          !isError && 'selectable',
        )}
        data-id={id}
      >
        {isError ? (
          <VideoErrorView onRemove={handleRemove} messageKey={errorMessageKey} />
        ) : (
          <>
            {renderMedia()}
            {/* Resize handles — shown only when selected and editable. */}
            {selected && isViewEditable(view) && (
              <>
                <div
                  className="top-left textory-video__resize-handle"
                  onMouseDown={e => handleMouseDown(e, 'top-left')}
                />
                <div
                  className="top-right textory-video__resize-handle"
                  onMouseDown={e => handleMouseDown(e, 'top-right')}
                />
                <div
                  className="bottom-left textory-video__resize-handle"
                  onMouseDown={e => handleMouseDown(e, 'bottom-left')}
                />
                <div
                  className="bottom-right textory-video__resize-handle"
                  onMouseDown={e => handleMouseDown(e, 'bottom-right')}
                />
              </>
            )}
          </>
        )}
      </span>
    </NodeViewWrapper>
  );
};
export default VideoView;
