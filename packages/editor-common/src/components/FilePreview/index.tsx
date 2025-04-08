import IconFont from '../IconFont';
import {doDownloadByUrl, isEsc} from '../../utils';
import Tooltip from '../Tooltip'; // import { Spin, Tooltip } from 'antd';
import ClassNames from 'classnames';
import {type CSSProperties, type FC, type ReactNode, useEffect, useRef, useState,} from 'react';
import {createPortal} from 'react-dom'; // import { CSSTransition } from 'react-transition-group';
import './index.scss';
import {AnimatePresence, motion} from 'framer-motion';
import {assign, isFunction, isString, size, some, split} from 'lodash-es';
import Spin from '../Spin';
import {IntlComponent} from '../../index.ts';

const formatScaleVal = val => {
  if (!val) return '';
  return `${Math.round(val * 100)}%`;
};

/**
 * 标准MIME: https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Complete_list_of_MIME_types
 */
const MIME = {
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  gif: 'image/gif',
  mp4: 'video/mp4',
  webm: 'video/webm',
  mov: 'video/quicktime',
  ogg: 'audio/ogg',
  mp3: 'audio/mp3',
  wav: 'audio/wav',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ppt: 'application/vnd.ms-powerpoint',
  pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  xls: 'application/vnd.ms-excel',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  pdf: 'application/pdf',
};

const judgeFileMIME = function judgeFileMIME(types: string[], type: any) {
  return some(types, function (key) {
    return type && MIME[key] === type;
  });
};

const isImageFile = function isImageFile(file) {
  if (judgeFileMIME(['png', 'jpg', 'jpeg', 'gif'], file.type)) {
    return true;
  }

  const ext = getFileExt(file.name || file.type);
  return /^(png|jpg|jpeg|gif)$/i.test(ext);
};

const isVideoFile = function isVideoFile(file) {
  if (judgeFileMIME(['mp4', 'webm', 'mov'], file.type)) {
    return true;
  }

  const ext = getFileExt(file.name);
  return /^(mp4|m4v|webm|mov)$/i.test(ext);
};

const isAudioFile = function isAudioFile(file) {
  if (judgeFileMIME(['ogg', 'mp3', 'wav'], file.type)) {
    return true;
  }

  const ext = getFileExt(file.name);
  return /^(ogg|mp3|wav)$/i.test(ext);
};

const isOfficeFile = function isOfficeFile(file) {
  if (judgeFileMIME(['doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx'], file.type)) {
    return true;
  }

  const ext = getFileExt(file.name);
  return /^(doc|docx|ppt|pptx|xls|xlsx)$/i.test(ext);
};

const isPdfFile = function isPdfFile(file) {
  if (judgeFileMIME(['pdf'], file.type)) {
    return true;
  }

  const ext = getFileExt(file.name);
  return /^pdf$/i.test(ext);
};

export const getFileExt = function getFileExt(fileName) {
  return isString(fileName) ? split(fileName, '.').pop() || '' : '';
};

export interface IFilePreviewFileProps {
  type?: string;
  downloadUrl?: string;
  previewUrl?: string;
  fileRender?: () => ReactNode;
  name?: string;
  clickOriginUrl?: string;
  url?: string;
}

export interface IFilePreviewProps {
  files: IFilePreviewFileProps[];
  activeIndex?: number;
  visible: boolean;
  onClose?: () => void;
  afterClose?: () => void;
  className?: string;
  style?: CSSProperties;
  unsupportedFileRender?: ReactNode;
  onSwitchFile?: (index?: number) => void;
  rightButtons?: ReactNode;
  renderControlBar?: (zoomIn: () => void, zoomOut: () => void) => ReactNode;
}

const FilePreview: FC<IFilePreviewProps> = ({
  files = [],
  activeIndex,
  visible,
  onClose,
  afterClose,
  className,
  style,
  unsupportedFileRender,
  onSwitchFile,
  rightButtons,
  renderControlBar,
}) => {
  // const { onFileDownload } = useContext(EditorContext);
  const [isLoading, setLoading] = useState(false);
  const [imageStyles, setImageStyles] = useState([]);
  const imageRef = useRef<HTMLImageElement>();
  const mouseInfo = useRef<any>({});
  const bodyRef = useRef<HTMLDivElement>();

  useEffect(() => {
    if (visible) {
      bodyRef?.current?.focus();
    }
  }, [visible]);

  const adjustImageStyle = index => {
    let style = imageStyles[index];

    if (!style || !style.isAdjusted) {
      // 初始化图片style
      if (!imageRef.current) {
        return;
      }

      const $image = imageRef.current;
      const imageW = $image.clientWidth;
      const imageH = $image.clientHeight;
      const containerW = window.innerWidth - 240;
      const containerH = window.innerHeight - 180;
      const scale = Math.min(containerW / imageW, containerH / imageH, 1);
      const newImageW = imageW * scale;
      const newImageH = imageH * scale;
      const paddingLeft = (containerW - newImageW) / 2;
      const paddingTop = (containerH - newImageH) / 2;
      const useOriginUrl = style?.useOriginUrl;
      style = {
        width: newImageW,
        height: newImageH,
        marginTop: paddingTop + 10,
        marginLeft: paddingLeft + 120,
        scale: scale,
        originScale: scale,
        rotate: 0,
        offsetX: 0,
        offsetY: 0,
        isAdjusted: true,
        useOriginUrl: useOriginUrl, // 是否使用原图url
      };
      const newImageStyles = imageStyles.slice();
      newImageStyles[index] = style;
      setImageStyles(newImageStyles);
    }
  };

  const createHeader = () => {
    const currentFile = getCurrentFile();
    return (
      <div className="preview-header">
        <div className="file-counter">
          {activeIndex + 1}/{files.length}
        </div>
        <div className="file-name">{currentFile?.name}</div>
        <div className="right-buttons-wrapper">
          {rightButtons || (
            <div
              className="download-btn"
              onClick={event => {
                event.stopPropagation();
                doDownloadByUrl(currentFile?.downloadUrl || currentFile?.url);
                // if (onFileDownload) {
                //   onFileDownload(currentFile);
                // } else {
                //   doDownloadByUrl(currentFile?.downloadUrl || currentFile?.url);
                // }
              }}
            >
              <IconFont
                type="download"
                style={{ fontSize: 20, marginRight: 5 }}
              />
              下载
            </div>
          )}
        </div>
        <div className="close-btn" onClick={onClose}>
          <IconFont type="icon-close" style={{ fontSize: 20 }} />
        </div>
      </div>
    );
  };

  const createBody = () => {
    const currentFile = getCurrentFile();
    console.log('currentFile是', currentFile);

    if (!currentFile) {
      return;
    }

    if (currentFile.fileRender) {
      return createCustomPreview();
    }

    // if (isImageFile(currentFile)) {
    //   return createImagePreview();
    // } else if (isVideoFile(currentFile)) {
    //   return createVideoPreview();
    // } else if (isAudioFile(currentFile)) {
    //   return createAudioPreview();
    // } else if (isOfficeFile(currentFile)) {
    //   return createOfficePreview();
    // } else if (isPdfFile(currentFile)) {
    //   return createPdfPreview();
    // } else {
    //   return createOtherPreview();
    // }
    if (isImageFile(currentFile)) {
      return createImagePreview();
    }
    if (isVideoFile(currentFile)) {
      return createVideoPreview();
    }
    if (isAudioFile(currentFile)) {
      return createAudioPreview();
    }
    return createOtherPreview();
  };

  const createImagePreview = () => {
    const currentFile = getCurrentFile();

    const style = assign(
      {
        marginLeft: 0,
        marginTop: 0,
        offsetX: 0,
        offsetY: 0,
        rotate: 0,
        isAdjusted: false,
      },
      imageStyles[activeIndex],
    );

    const cssStyle = {
      height: style.height,
      width: style.width,
      marginLeft: style.marginLeft + style.offsetX,
      marginTop: style.marginTop + style.offsetY,
      transform: `rotate(${style.rotate}deg)`,
    };
    const scaleVal = style.scale;

    const { url: imageUrl, originUrl, useOriginUrl } = getPreviewImageUrl();

    return (
      <div
        className="preview-body"
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onClick={onClose}
      >
        {createSwitchBtns()}
        <Spin spinning={isLoading}>
          <img
            key={''
              .concat(String(activeIndex), '-')
              .concat(imageUrl, '-')
              .concat(String(useOriginUrl))}
            alt=""
            className={ClassNames('preview-image', {
              invisible: !style.isAdjusted,
            })}
            draggable={false}
            src={imageUrl}
            style={cssStyle}
            ref={imageRef}
            onLoad={onImageLoaded(activeIndex)}
            onMouseDown={onMouseDown}
            onClick={e => {
              e.stopPropagation();
            }}
          />
        </Spin>
        <div
          className="preview-control"
          onClick={e => {
            e.stopPropagation();
          }}
        >
          {typeof renderControlBar === 'function' ? (
            renderControlBar(onImageScale('enlarge'), onImageScale('shrink'))
          ) : (
            <div className="control-content">
              <Tooltip content={IntlComponent.get('zoom-in')} placement="top">
                <IconFont
                  type="zoom-in"
                  className="enlarge"
                  onClick={onImageScale('enlarge')}
                />
              </Tooltip>
              <span className="scale-val">{formatScaleVal(scaleVal)}</span>
              <Tooltip content={IntlComponent.get('zoom-out')} placement="top">
                <IconFont
                  type="zoom-out"
                  className="shrink"
                  onClick={onImageScale('shrink')}
                />
              </Tooltip>

              <Tooltip content="向右旋转" placement="top">
                <IconFont
                  type="reload"
                  className="rotate"
                  onClick={() => onImageRotate(true)}
                />
              </Tooltip>
            </div>
          )}
        </div>
      </div>
    );
  };

  const createSwitchBtns = () => {
    return (
      <div
        onClick={e => {
          e.stopPropagation();
        }}
      >
        {activeIndex > 0 && (
          <div className="arrow-wrapper left" onClick={switchFile('prev')}>
            <IconFont type="left" className="arrow-left" />
          </div>
        )}
        {activeIndex < size(files) - 1 && (
          <div className="arrow-wrapper right" onClick={switchFile('next')}>
            <IconFont type="right" className="arrow-right" />
          </div>
        )}
      </div>
    );
  };

  const createVideoPreview = () => {
    const currentFile = getCurrentFile();
    return (
      <div className="preview-body" onClick={onClose}>
        {createSwitchBtns()}
        <video
          key={activeIndex}
          className="preview-video preview-center"
          src={currentFile.previewUrl}
          preload="metadata"
          controls
        />
      </div>
    );
  };

  const createAudioPreview = () => {
    const currentFile = getCurrentFile();
    return (
      <div className="preview-body" onClick={onClose}>
        {createSwitchBtns()}
        <audio
          key={activeIndex}
          className="preview-audio preview-center"
          src={currentFile.previewUrl}
          controls
        />
      </div>
    );
  };

  const createOtherPreview = () => {
    let content = null;
    const file = getCurrentFile();
    if (isFunction(unsupportedFileRender)) {
      content = unsupportedFileRender(file);
    } else {
      const url = file?.downloadUrl || file?.url;
      content = (
        <div className="preview-other preview-center">
          当前文件类型不支持在线预览，请
          <a className="download-btn" href={url}>
            下载
          </a>
          后查看
        </div>
      );
    }

    return (
      <div className="preview-body" onClick={onClose}>
        {createSwitchBtns()}
        {content}
      </div>
    );
  };
  /**
   * 图片加载之后的回调
   * @param index
   */
  const onImageLoaded = index => {
    return function () {
      setLoading(false);
      const $image = imageRef.current;

      const checkImageSize = () => {
        if ($image && $image.clientWidth > 0 && $image.clientHeight > 0) {
          adjustImageStyle(index);
        } else {
          requestAnimationFrame(checkImageSize);
        }
      };

      checkImageSize();
    };
  };

  /**
   * 图片缩放
   * @param type
   */

  const onImageScale = function (type) {
    return function () {
      const oldStyle = imageStyles[activeIndex];
      const scale2Origin = type === 'origin';
      let scaleRadio = 1;

      if (type === 'enlarge') {
        scaleRadio = 1.25;
      } else if (type === 'shrink') {
        scaleRadio = 0.75;
      } else if (scale2Origin) {
        scaleRadio = 1 / oldStyle.scale;
      }

      const newScale = scale2Origin ? 1 : oldStyle.scale * scaleRadio;
      const minScale = Math.min(oldStyle.originScale, 0.15);
      const maxScale = 5;

      if (newScale <= minScale || newScale > maxScale) {
        return;
      }

      const newW = oldStyle.width * scaleRadio;
      const newH = oldStyle.height * scaleRadio;
      const newMarginLeft = oldStyle.marginLeft - (newW - oldStyle.width) / 2;
      const newMarginTop = oldStyle.marginTop - (newH - oldStyle.height) / 2;
      const newImageStyles = imageStyles.slice();
      const style = Object.assign(Object.assign({}, oldStyle), {
        width: newW,
        height: newH,
        marginLeft: newMarginLeft,
        marginTop: newMarginTop,
        scale: newScale,
      });
      newImageStyles.splice(activeIndex, 1, style);

      setImageStyles(newImageStyles);
    };
  };
  /**
   * 图片旋转
   * isClockwise 是否顺时针旋转
   */

  const onImageRotate = function (isClockwise) {
    const oldStyle = imageStyles[activeIndex];
    const newImageStyles = imageStyles.slice();
    const style = Object.assign(Object.assign({}, oldStyle), {
      rotate: isClockwise ? oldStyle.rotate + 90 : oldStyle.rotate - 90,
    });
    newImageStyles.splice(activeIndex, 1, style);

    setImageStyles(newImageStyles);
  };
  /**
   * 查看原图
   */

  const onViewOriginImage = function () {
    const oldStyle = imageStyles[activeIndex];

    if (oldStyle.useOriginUrl) {
      // 已经是原图url
      return false;
    }

    setLoading(true);

    const newStyle = {
      isAdjusted: false,
      useOriginUrl: true,
    };

    setImageStyles(imageStyles => {
      const newImageStyles = imageStyles.slice();
      newImageStyles.splice(activeIndex, 1, newStyle);
      return newImageStyles;
    });
  };

  const onMouseDown = e => {
    const info = mouseInfo.current;
    info.dragging = true;
    info.beginX = e.clientX;
    info.beginY = e.clientY;
  };

  const onMouseMove = function (e) {
    const { dragging, beginX, beginY } = mouseInfo.current || {};
    if (!dragging) {
      return;
    }

    const oldStyle = imageStyles[activeIndex];
    const newImageStyles = imageStyles.slice();
    const style = Object.assign(Object.assign({}, oldStyle), {
      offsetX: e.clientX - beginX,
      offsetY: e.clientY - beginY,
    });
    newImageStyles.splice(activeIndex, 1, style);
    setImageStyles(newImageStyles);
  };

  const onMouseUp = function () {
    const { dragging } = mouseInfo.current || {};
    if (!dragging) {
      return;
    }
    const info = mouseInfo.current;
    info.dragging = false;
    const $image = imageRef.current;
    if (!$image) return;
    const oldStyle = imageStyles[activeIndex];
    const newImageStyles = imageStyles.slice();
    const style = {
      ...oldStyle,
      offsetX: 0,
      offsetY: 0,
      marginLeft: Number.parseFloat($image.style.marginLeft),
      marginTop: Number.parseFloat($image.style.marginTop),
    };
    newImageStyles.splice(activeIndex, 1, style);
    setImageStyles(newImageStyles);
  };
  /**
   * 图片切换
   * @param direction
   */

  const switchFile = function (direction) {
    return function () {
      let newIndex = activeIndex;

      if (direction === 'prev') {
        newIndex -= 1;
      } else if (direction === 'next') {
        newIndex += 1;
      }

      setLoading(true);

      if (onSwitchFile) {
        onSwitchFile(newIndex);
      }
    };
  };

  const handleAfterExit = function () {
    // setLoading(true)
    setImageStyles([]);
    afterClose?.();
  };

  const createCustomPreview = function () {
    const currentFile = getCurrentFile();

    const fileRender = currentFile.fileRender;
    return (
      <div className="preview-body">
        {createSwitchBtns()}
        {fileRender?.()}
      </div>
    );
  };

  const getCurrentFile = () => {
    return files[activeIndex];
  };
  /**
   * 获取当前预览图片的url
   */
  const getPreviewImageUrl = function () {
    const file = getCurrentFile();
    return {
      url: file.previewUrl || file.url,
      originUrl: file.clickOriginUrl,
      useOriginUrl: !!file.clickOriginUrl,
    };
  };

  return createPortal(
    <AnimatePresence onExitComplete={handleAfterExit}>
      {visible && (
        <motion.div
          className="file-preview"
          initial={{ opacity: 0 }} // 进入前的初始状态
          animate={{ opacity: 1 }} // 进入时的动画
          exit={{ opacity: 0 }} // 退出时的动画
          transition={{ duration: 0.2 }} // 对应 timeout={200}
        >
          <div
            ref={bodyRef}
            className={ClassNames('easy-editor-file-preview', className)}
            style={style}
            onKeyDown={e => {
              if (isEsc(e) && visible) {
                onClose();
                e.stopPropagation();
              }
            }}
          >
            {createHeader()}
            {createBody()}
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
};
export default FilePreview;
