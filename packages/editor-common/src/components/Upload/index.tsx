import Button from '../Button';
import {message} from '../Message';
import Upload from 'rc-upload';
import classnames from 'classnames';
import {isEmpty, noop, take} from 'lodash-es';
import React, {type FC, type ReactNode, useRef, useState} from 'react';
import type {RcFile, UploadProgressEvent, UploadRequestOption,} from 'rc-upload/es/interface'; //import uuid from 'uuid/v4';
//import uuid from 'uuid/v4';

const uploadButton = <Button>点击上传</Button>;

function attrAccept(
  file: { name: string; type: string },
  acceptedFiles: string,
) {
  if (file && acceptedFiles) {
    const acceptedFilesArray = Array.isArray(acceptedFiles)
      ? acceptedFiles
      : acceptedFiles.split(',');
    const fileName = file.name || '';
    const mimeType = file.type || '';
    const baseMimeType = mimeType.replace(/\/.*$/, '');

    return acceptedFilesArray.some(type => {
      const validType = type.trim();
      if (validType === '*') {
        return true;
      }
      if (validType.charAt(0) === '.') {
        return fileName.toLowerCase().endsWith(validType.toLowerCase());
      }
      if (/\/\*$/.test(validType)) {
        // This is something like a image/* mime type
        return baseMimeType === validType.replace(/\/.*$/, '');
      }
      return mimeType === validType;
    });
  }
  return true;
}

export interface IUploadProps {
  onProgress?: (event: UploadProgressEvent, file: RcFile) => void;
  onError: (error: Error, ret: Record<string, unknown>, file: RcFile) => void;
  onStart?: (file: RcFile) => void;
  onSuccess?: (res: any, file: RcFile) => void;
  listType?: string;
  onPreview?: () => void;
  onChange?: (file: RcFile) => void;
  beforeUpload?: (file: RcFile) => void;
  customRequest?: (options: UploadRequestOption) => void;
  customVideoUpload?: (file: RcFile) => void;
  onUploaded?: (file: RcFile) => void;
  autoScrollIntoView?: boolean;
  action?: string;
  showUploadList?: boolean;
  enableGlobalPaste?: boolean;
  multiple?: boolean;
  disabled?: boolean;
  acceptErrMsg?: ReactNode;
  accept?: string;
  children?: ReactNode;
  rules?: any[];
  exceedMaxFileNumMsg?: boolean;
  maxFileNum?: number;
  maxFileSize?: number;
  fileList?: any[];
  className?: string;
  id?: string;
}

const FileUpload: FC<IUploadProps> = props => {
  const [dragOver, setDragOver] = useState(false);
  const {
    onProgress,
    onError,
    onPreview,
    id,
    className,
    action,
    customVideoUpload,
    onStart,
    customRequest,
    onUploaded,
    onSuccess,
    beforeUpload = undefined,
    fileList = [],
    maxFileSize = undefined,
    maxFileNum = undefined,
    rules = [],
    children = undefined,
    disabled = false,
    accept = '*',
    acceptErrMsg = undefined,
    listType = 'text',
    // action: `${config.baseUrl}/file/upload`,
    showUploadList = undefined,
    enableGlobalPaste = false,
    exceedMaxFileNumMsg = '',
    multiple = false,
    onChange = noop,
    autoScrollIntoView = false,
  } = props;
  const batchUploadNum = useRef(0);
  const uploadRef = useRef<any>();
  const uploadBtnRef = useRef<any>();

  const onPaste = e => {
    if (e.defaultPrevented) {
      // 富文本框中已经处理了附件上传,并且会同步传送到附件字段
      return;
    }
    if (disabled || !enableGlobalPaste) {
      return;
    }
    const files = e.clipboardData.files;
    if (!isEmpty(files)) {
      upload(files);
    }
  };

  const upload = files => {
    if (autoScrollIntoView) {
      uploadBtnRef.current?.scrollIntoView?.({ behavior: 'smooth' });
    }
    const uploader = uploadRef.current?.upload?.uploader;
    // 过滤掉已经在上传的 当拖拽在本控件上时,会自动触发上传,避免外层容器再次上传
    const fileArr = Array.prototype.slice.call(files).filter(file => !file.uid);
    if (isEmpty(fileArr)) {
      return;
    }
    let acceptFiles = fileArr.filter(file => attrAccept(file, accept));
    if (acceptFiles.length !== files.length) {
      message.error(
        <span>
          上传附件格式不符合
          <div style={{ color: 'rgba(0, 0, 0, 0.45)', fontSize: 12 }}>
            {acceptErrMsg}
          </div>
        </span>,
      );
    }
    if (maxFileNum && acceptFiles.length + fileList.length > maxFileNum) {
      message.error(exceedMaxFileNumMsg || '超出文件数量限制');
      acceptFiles = take(acceptFiles, maxFileNum - fileList.length);
    }
    if (uploader && !isEmpty(acceptFiles)) {
      uploader.uploadFiles(acceptFiles);
    }
  };

  const beforeUploadFun = (file, fileList) => {
    console.log('beforeUploadFun触发', file, fileList);
    console.log(file, fileList);
    return new Promise<string>(resolve => {
      resolve(file);
    });
    //if (beforeUpload && !beforeUpload(file, fileList)) {
    //  return false;
    //}

    //if (batchUploadNum.current <= 0) {
    //  batchUploadNum.current =
    //    Math.max(batchUploadNum.current, 0) + fileList.length;
    //}
    //const markAsError = errorMsg => {
    //  file.response = errorMsg;
    //  file.status = 'error';
    //  const originFile = (fileList || []).find(({ uid }) => uid === file.uid);
    //  originFile.response = errorMsg;
    //  originFile.status = 'error';
    //
    //  message.error(errorMsg);
    //  batchUploadNum.current = Math.max(batchUploadNum.current - 1, 0);
    //};
    //const uidList = uniq(
    //  []
    //    .concat(props.fileList)
    //    .concat(fileList)
    //    .map(({ uid }) => uid),
    //);
    //const index = uidList.indexOf(file.uid);
    //if (
    //  maxFileNum &&
    //  (index >= maxFileNum || (index < 0 && uidList.length >= maxFileNum))
    //) {
    //  markAsError(exceedMaxFileNumMsg || '超出文件数量限制');
    //  return false;
    //}
    //
    //if (!isEmpty(rules)) {
    //  return checkRule(file, rules).catch(e => {
    //    markAsError(e.message);
    //    return Promise.reject(e);
    //  });
    //}
    //if (maxFileSize) {
    //  return checkMaxSize(file, maxFileSize).catch(e => {
    //    markAsError(e.message);
    //    return Promise.reject(e);
    //  });
    //}
  };

  const checkMaxSize = (file, maxSize) => {
    if (!maxSize) {
      return Promise.resolve(file);
    }

    const checkFileSize =
      Number.parseFloat((file.size / 1024 / 1024).toFixed(4)) <= maxSize;
    if (!checkFileSize) {
      return Promise.reject(new Error(`文件大小不能大于${maxSize}M`));
    }
    return Promise.resolve(file);
  };

  const checkRule = (file, rules) => {
    if (isEmpty(rules)) {
      return Promise.resolve(file);
    }

    const fileType = file.type;
    const fileSize = getFileSize(file);
    const failRule = rules.find(rule => {
      return attrAccept(file, rule.type) && fileSize > rule.size;
    });
    if (failRule) {
      if (fileType.includes('image')) {
        // 图片类尝试做一次压缩
        return compressImage(file).then(newFile => {
          if (getFileSize(newFile) > failRule.size) {
            return Promise.reject(
              new Error(
                `${failRule.label || ''}文件大小不能大于${failRule.size}M`,
              ),
            );
          }
          return newFile;
        });
      }
      return Promise.reject(
        new Error(`${failRule.label || ''}文件大小不能大于${failRule.size}M`),
      );
    }

    return Promise.resolve(file);
  };

  const getFileSize = file => {
    return Number.parseFloat((file.size / 1024 / 1024).toFixed(4));
  };

  const compressImage = (file, quality = 0.3) => {
    return new Promise((resolve, reject) => {
      // 图片压缩
      const reader = new FileReader();
      const img = new Image();
      reader.readAsDataURL(file);
      reader.onload = e => {
        typeof e.target.result === 'string' ? (img.src = e.target.result) : '';
      };

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        const originWidth = img.width;
        const originHeight = img.height;

        canvas.width = originWidth;
        canvas.height = originHeight;

        context.clearRect(0, 0, originWidth, originHeight);
        context.drawImage(img, 0, 0, originWidth, originHeight);

        const { type, name, uid } = file;
        canvas.toBlob(
          blob => {
            const imgFile = new File([blob], name, { type }); // 将blob对象转化为图片文件
            // imgFile.uid = uid;
            resolve(imgFile);
          },
          file.type,
          quality || 0.3,
        ); // file压缩的图片类型
      };
      img.onerror = () => {
        reject();
      };
    });
  };

  const handleOnChange = value => {
    const { file, fileList, event } = value;
    const { status, response } = file;
    const fileIndex = fileList.findIndex(fileItem => fileItem.uid === file.uid);
    if (status === 'done') {
      if (!response.success) {
        fileList[fileIndex].response = response.message;
        fileList[fileIndex].status = 'error';
        batchUploadNum.current = Math.max(batchUploadNum.current - 1, 0);
      } else {
        const fileKey = response.data.fileKey;
        const id = response.data.id || 0;
        const url = response.data.url || '';
        const thumbUrl = response.data.thumbUrl || url;
        const previewUrl = response.data.previewUrl || thumbUrl;
        const downloadUrl = response.data.downloadUrl || url;
        const originUrl = response.data.originUrl || url;
        const src = url || '';
        file.fileKey = fileKey;
        file.id = id;
        // 兼容简道云文档编辑器
        file.thumbUrl = thumbUrl;
        file.downloadUrl = downloadUrl;
        file.previewUrl = previewUrl;
        file.url = url;
        file.originUrl = originUrl;

        const originFile = fileList[fileIndex];
        originFile.id = id;
        originFile.src = src;
        originFile.thumbUrl = thumbUrl;
        originFile.previewUrl = previewUrl;
        originFile.downloadUrl = downloadUrl;
        originFile.originUrl = originUrl;
        originFile.url = url;

        if (
          batchUploadNum.current <= 1 ||
          !fileList.some(item => item.status === 'uploading')
        ) {
          batchUploadNum.current = 0;
        }
      }
    }

    onUploaded?.(value);
    onChange?.(value);
  };

  const formatFileUrl = () => {
    return fileList.map(file => {
      const targetFile = { ...file };
      if (!isEmpty(file.url)) {
        targetFile.url = `${file.url}?response-content-disposition=attachment&attname=${file.name}`;
      }
      return targetFile;
    });
  };

  const getCustomRequest = (option: UploadRequestOption) => {
    console.log('getCustomRequest触发', option);
    const file = option.file;
    const originRequest = null;
    let canceled = false;
    customRequest?.(option);
    //const isVideo = file => {
    //  return isVideoExt(parseMIMEType(file.type)[1]);
    //};
    //if (customRequest || customVideoUpload) {
    //  try {
    //    if (isVideo(file) && customVideoUpload) {
    //      customVideoUpload(option);
    //    } else {
    //      customRequest(option);
    //    }
    //  } catch (err) {
    //    option.onError(err, { message: '上传失败' });
    //  }
    //}

    // originRequest = ajaxRequest({
    //   ...option,
    //   method: 'PUT',
    //   action: '',
    //   headers: {
    //     ...option.headers,
    //     'Content-Type': 'image/png',
    //   },
    //   onError: (err) => {
    //     option.onError(err, { message: '上传失败' });
    //   },
    //   onSuccess: (_, xhr) => {
    //     // 填充原始的file model
    //     setTimeout(() => {
    //       option.onSuccess(
    //         {
    //           success: true,
    //           data: {
    //             url: 'https://bbs.fanruan.com/source/plugin/it618_video/kindeditor/attached/image/20230417/20230417192156_92893.jpg',
    //           },
    //         },
    //         xhr,
    //       );
    //     }, 3000);
    //   },
    // });
    return {
      abort: () => {
        canceled = true;
        originRequest?.abort();
      },
    };
  };

  return (
    <>
      <Upload
        id={id}
        className={className}
        ref={uploadRef}
        beforeUpload={beforeUploadFun}
        action={action}
        //onChange={handleOnChange}
        onSuccess={onSuccess}
        onError={onError}
        onProgress={onProgress}
        // fileList={formatFileUrl()}
        // listType={listType}
        disabled={disabled}
        accept={accept}
        // showUploadList={showUploadList}
        multiple={multiple}
        // onPreview={onPreview}
        // maxCount={maxFileNum}
        customRequest={getCustomRequest}
        onStart={onStart}
      >
        <div
          ref={uploadBtnRef}
          className={classnames('uploader-trigger', {
            'drag-over': dragOver,
          })}
          onDragEnter={() => setDragOver(true)}
          onDragLeave={() => setDragOver(false)}
        >
          {children || uploadButton}
        </div>
      </Upload>
      {/*<EventListener target={document} onPaste={onPaste} />*/}
    </>
  );
};
export default FileUpload;
