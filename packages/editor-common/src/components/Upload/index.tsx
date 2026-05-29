import Button from '../Button';
import {message} from '../Message';
import Upload from 'rc-upload';
import classnames from 'classnames';
import {isEmpty, take} from 'lodash-es';
import React, {type FC, type ReactNode, useRef, useState} from 'react';
import type {RcFile, UploadProgressEvent, UploadRequestOption,} from 'rc-upload/es/interface';
import type {Editor} from '@tiptap/core'; //import uuid from 'uuid/v4';
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
  beforeUpload?: (file: RcFile, fileList: RcFile[]) => boolean;
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
  editor: Editor;
}

const FileUpload: FC<IUploadProps> = props => {
  const [dragOver, setDragOver] = useState(false);
  const {
    onProgress,
    onError,
    onPreview,
    id,
    className,
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
    enableGlobalPaste = false,
    exceedMaxFileNumMsg = '',
    multiple = false,
    autoScrollIntoView = false,
    editor,
  } = props;
  const uploadRef = editor.view.someProp('imgUploader');
  const uploadBtnRef = useRef<any>();

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

  const beforeUploadFun = (file: RcFile, fileList: RcFile[]) => {
    console.log('beforeUploadFun触发', file, fileList);
    if (beforeUpload && !beforeUpload(file, fileList)) {
      return false;
    }
    return new Promise<string>(resolve => {
      resolve('');
    });
  };

  const getCustomRequest = (option: UploadRequestOption) => {
    try {
      customRequest?.(option);
    } catch (err) {
      option.onError(err, { message: '上传失败' });
    }
  };

  return (
    <>
      <Upload
        id={id}
        className={className}
        ref={uploadRef}
        beforeUpload={beforeUploadFun}
        onSuccess={onSuccess}
        onError={onError}
        onProgress={onProgress}
        disabled={disabled}
        accept={accept}
        multiple={multiple}
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
    </>
  );
};
export default FileUpload;
