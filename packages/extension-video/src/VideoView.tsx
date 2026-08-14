import {NodeViewWrapper, useEditorState} from '@tiptap/react';
import type {NodeViewProps} from '@tiptap/core';
import cx from 'classnames';
import {isViewEditable} from '@textory/editor-utils';
import {IntlComponent, message, Popover} from '@textory/editor-common';
import {useEditorContext} from '@textory/context';
import {type FC, useCallback, useRef, useState} from 'react';
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
  const [isPosterLoading, setIsPosterLoading] = useState(false);
  const {props: editorProps} = useEditorContext();
  const onPosterUpload = editorProps.videoProps?.onPosterUpload;
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

  /**
   * Capture the current playback frame to a PNG and persist it as the
   * node's `poster`.
   *
   * Flow:
   * 1. Capture canvas → Blob (try direct; on taint, retry via offscreen
   *    `<video crossOrigin="anonymous">` for CORS-enabled hosts).
   * 2. If `videoProps.onPosterUpload` is configured → upload the Blob,
   *    store returned URL. Avoids multi-MB base64 dataURLs bloating
   *    editor state.
   * 3. Otherwise → fall back to dataURL (works but heavy).
   *
   * Same-origin / blob: / data: / CORS-enabled sources: step 1 succeeds
   * directly. Cross-origin without CORS headers: step 2 of capture fails,
   * localized error shown, any existing poster stays intact.
   */
  const handleSetPoster = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;
    if (isPosterLoading) return;
    setIsPosterLoading(true);
    const targetTime = video.currentTime;

    const captureBlob = (v: HTMLVideoElement): Promise<Blob | null> => {
      const w = v.videoWidth;
      const h = v.videoHeight;
      if (!w || !h) return Promise.resolve(null);
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (!ctx) return Promise.resolve(null);
      try {
        ctx.drawImage(v, 0, 0, w, h);
      } catch {
        return Promise.resolve(null);
      }
      // Some browsers (WebKit/Safari) throw SecurityError synchronously
      // when toBlob is called on a tainted canvas. Chrome/Firefox just
      // invoke the callback with null. Wrap the call so both forms
      // resolve to null instead of rejecting.
      return new Promise(resolve => {
        try {
          canvas.toBlob(b => resolve(b), 'image/png');
        } catch {
          resolve(null);
        }
      });
    };

    const reportCaptureError = () => {
      message.error(IntlComponent.get('video.poster.capture.failed'));
    };
    const reportUploadError = () => {
      message.error(IntlComponent.get('video.poster.upload.failed'));
    };

    try {
      // 1) Direct capture. Defensive .catch — captureBlob is expected to
      //    resolve null on taint, but a rejected promise here would
      //    short-circuit the entire handler before the fallback runs.
      let blob = await captureBlob(video).catch(() => null);

      // 2) Fallback for tainted canvas: offscreen <video crossOrigin="anonymous">
      //    reloaded at the same timestamp. Only succeeds if the server
      //    sends `Access-Control-Allow-Origin`.
      if (!blob) {
        const fallbackSrc = video.src || video.currentSrc;
        if (!fallbackSrc) {
          reportCaptureError();
          return;
        }
        blob = await new Promise<Blob | null>(resolve => {
          const off = document.createElement('video');
          off.crossOrigin = 'anonymous';
          off.muted = true;
          off.playsInline = true;
          off.preload = 'auto';
          let settled = false;
          const done = (b: Blob | null) => {
            if (!settled) {
              settled = true;
              resolve(b);
            }
          };
          off.onloadedmetadata = () => {
            try {
              off.currentTime = targetTime;
            } catch {
              captureBlob(off)
                .catch(() => null)
                .then(done);
            }
          };
          off.onseeked = () => {
            captureBlob(off)
              .catch(() => null)
              .then(done);
          };
          off.onerror = () => done(null);
          off.src = fallbackSrc;
        });
      }

      if (!blob) {
        reportCaptureError();
        return;
      }

      // 3) Upload if handler is configured; otherwise fall back to dataURL.
      //    Both paths are awaited so the loading flag clears only after
      //    the poster is actually written into attrs.
      if (!onPosterUpload) {
        await new Promise<void>(resolve => {
          const reader = new FileReader();
          reader.onload = () => {
            updateAttributes({poster: reader.result as string});
            resolve();
          };
          reader.onerror = () => {
            reportCaptureError();
            resolve();
          };
          reader.readAsDataURL(blob!);
        });
        return;
      }

      try {
        const file = new File([blob], 'poster.png', {type: 'image/png'});
        const url = await new Promise<string>((resolve, reject) => {
          let settled = false;
          try {
            const ret = onPosterUpload({
              file,
              onSuccess: (body: unknown) => {
                if (settled) return;
                settled = true;
                resolve(
                  typeof body === 'string' ? body : ((body as any)?.url ?? ''),
                );
              },
              onError: (err: unknown) => {
                if (settled) return;
                settled = true;
                reject(err);
              },
            });
            if (typeof ret === 'string') {
              if (!settled) {
                settled = true;
                resolve(ret);
              }
            } else if (ret && typeof (ret as any).then === 'function') {
              (ret as Promise<string>).then(
                u => {
                  if (!settled) {
                    settled = true;
                    resolve(u);
                  }
                },
                e => {
                  if (!settled) {
                    settled = true;
                    reject(e);
                  }
                },
              );
            }
            // callback-style: wait for onSuccess/onError
          } catch (err) {
            if (!settled) {
              settled = true;
              reject(err);
            }
          }
        });
        if (url) {
          updateAttributes({poster: url});
        } else {
          reportUploadError();
        }
      } catch {
        reportUploadError();
      }
    } finally {
      setIsPosterLoading(false);
    }
  }, [updateAttributes, onPosterUpload, isPosterLoading]);

  const handleClearPoster = useCallback(() => {
    updateAttributes({poster: null});
  }, [updateAttributes]);

  const handleRemove = () => {
    const pos = getPos();
    if (typeof pos !== 'number') return;
    const tr = view.state.tr.delete(pos, pos + 1);
    view.dispatch(tr);
    view.focus();
  };

  /**
   * [drag-handle] 原生 drag-and-drop 已关闭,统一由 @textory/extension-drag-handle
   * 处理 block 节点拖动。VideoNode 的 `draggable()` 也已注释。详见 .ai/docs/drag-handle.md。
   * 如需恢复,取消下方 useEffect 注释,并在 VideoNode.ts 恢复 `draggable()`。
   */
  // useEffect(() => {
  //   const editorDom = editor.view.dom;
  //
  //   const handleDragOver = (event: DragEvent) => {
  //     event.preventDefault();
  //   };
  //
  //   const handleDrop = (event: DragEvent) => {
  //     const pos = editor.view.posAtCoords({
  //       left: event.clientX,
  //       top: event.clientY,
  //     });
  //     const currentPos = getPos?.();
  //     if (!pos || typeof currentPos !== 'number') return;
  //     event.preventDefault();
  //     const insertPos = pos.pos > currentPos ? pos.pos - 1 : pos.pos;
  //     const tr = editor.view.state.tr
  //       .delete(currentPos, currentPos + 1)
  //       .insert(insertPos, node);
  //     editor.view.dispatch(tr);
  //   };
  //
  //   editorDom.addEventListener('dragover', handleDragOver);
  //   editorDom.addEventListener('drop', handleDrop);
  //   return () => {
  //     editorDom.removeEventListener('dragover', handleDragOver);
  //     editorDom.removeEventListener('drop', handleDrop);
  //   };
  // }, [editor, getPos, node]);

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
            onSetPoster={handleSetPoster}
            onClearPoster={handleClearPoster}
            hasPoster={!!poster}
            posterLoading={isPosterLoading}
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
