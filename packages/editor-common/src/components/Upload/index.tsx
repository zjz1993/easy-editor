import {Button, message} from '@textory/editor-common-ui';
import Upload from 'rc-upload';
import classnames from 'classnames';
import {isEmpty, take} from 'lodash-es';
import React, {type FC, type ReactNode, useRef, useState} from 'react';
import type {RcFile, UploadProgressEvent, UploadRequestOption,} from 'rc-upload/es/interface';
import type {Editor} from '@tiptap/core';
import IntlComponent from 'react-intl-universal';
import {checkMaxSize} from "../../utils/index.ts"; //import uuid from 'uuid/v4';
//import uuid from 'uuid/v4';

// render 时取值，保证 intl 初始化后能拿到正确文案
const uploadButton = <Button>{IntlComponent.get('upload.button.text') || '点击上传'}</Button>;

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
  /**
   * Which editor-view prop holds the rc-upload ref this component binds to.
   *
   * - `'imgUploader'` (default): binds to the image-upload ref set on
   *   `editorProps.imgUploader` in `root.tsx`. Backwards compatible.
   * - `'fileUploader'`: binds to the file-upload ref. Used by `FileButton`.
   *
   * The ref itself is created in `editor-main/root.tsx` and exposed via
   * ProseMirror `editorProps` so the paste/drop plugin can also reach it.
   */
  uploaderKey?: 'imgUploader' | 'fileUploader' | 'videoUploader';
}

const FileUpload: FC<IUploadProps> = props => {
  const [dragOver, setDragOver] = useState(false);
  const {
    onProgress,
    onError,
    id,
    className,
    onStart,
    customRequest,
    onSuccess,
    beforeUpload = undefined,
    fileList = [],
    maxFileNum = undefined,
    children = undefined,
    disabled = false,
    accept = '*',
    acceptErrMsg = undefined,
    exceedMaxFileNumMsg = '',
    multiple = false,
    autoScrollIntoView = false,
    editor,
    uploaderKey = 'imgUploader',
  } = props;
  const uploadRef = editor.view.someProp(uploaderKey);
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
          {IntlComponent.get('upload.error.invalid.format') || '上传附件格式不符合'}
          <div style={{ color: 'rgba(0, 0, 0, 0.45)', fontSize: 12 }}>
            {acceptErrMsg}
          </div>
        </span>,
      );
    }
    if (maxFileNum && acceptFiles.length + fileList.length > maxFileNum) {
      message.error(exceedMaxFileNumMsg || (IntlComponent.get('upload.error.exceed.limit') || '超出文件数量限制'));
      acceptFiles = take(acceptFiles, maxFileNum - fileList.length);
    }
    if (uploader && !isEmpty(acceptFiles)) {
      uploader.uploadFiles(acceptFiles);
    }
  };

  const beforeUploadFun = (file: RcFile, fileList: RcFile[]) => {
    if (beforeUpload && !beforeUpload(file, fileList)) {
      return false;
    }
    if (props.maxFileSize) {
      return checkMaxSize(file, props.maxFileSize).catch(e => {
        message.error(e.message);
        return Promise.reject(e);
      });
    }
    return true;
  };

  const getCustomRequest = (option: UploadRequestOption) => {
    if (!customRequest) return;
    // IIFE so we can `await` even though rc-upload's customRequest type
    // expects `void` synchronously. Async rejections inside the user's
    // uploader are caught here and surfaced via `option.onError`;
    // previously this was a fire-and-forget call, so any async failure
    // (rejected fetch/XHR) bypassed the try/catch and the upstream
    // `onError` prop never fired.
    void (async () => {
      try {
        await customRequest(option);
      } catch (err) {
        option.onError?.(err as Error, { message: IntlComponent.get('upload.error.failed') || '上传失败' });
      }
    })();
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
