import {DropdownList, Iconfont, Upload} from '@textory/editor-common';
import React, {type FC, useContext, useState} from 'react';
import type {TToolbarWrapperProps} from 'src/types/index.ts';
import UploadNetworkImageModal from './UploadNetworkImageModal.tsx';
import ToolbarContext from '../../context/toolbarContext.ts';
import cx from 'classnames';
import {v4 as uuid} from 'uuid';
import ToolbarItemButtonWrapper from '../ToolbarItemButtonWrapper';
import type {Editor} from '@tiptap/core';
import {removeUploadProgress, updateUploadProgress,} from '@textory/extension-image';
import {makeCustomRequest} from '../../utils/makeCustomRequest.ts';
import type {IImageProps} from '@textory/context';

function getEditorWidth(editor: Editor) {
  return editor.view.dom.clientWidth;
}

function calculateSize(
  naturalWidth: number,
  naturalHeight: number,
  editorWidth: number,
) {
  if (naturalWidth <= editorWidth) {
    return {
      width: naturalWidth,
      height: naturalHeight,
    };
  }

  const ratio = editorWidth / naturalWidth;

  return {
    width: editorWidth,
    height: naturalHeight * ratio,
  };
}

function getImageSizeFromFile(file: File) {
  return new Promise<{ width: number; height: number }>(resolve => {
    const img = new window.Image();
    img.onload = () => {
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
    };
    img.src = URL.createObjectURL(file);
  });
}

const ImageButton: FC<TToolbarWrapperProps> = props => {
  const { disabled, intlStr, style, editor } = props;
  const { imageProps } = useContext(ToolbarContext);
  const [open, setOpen] = useState(false);
  const { onImageUpload, onImageBeforeUpload, maxFileSize, onImageStartUpload, onImageEndUpload } = imageProps;
  return (
    <>
      <ToolbarItemButtonWrapper
        intlStr={intlStr}
        className={cx(
          'textory-toolbar__item__btn',
          'textory-toolbar__item__dropdown',
        )}
        style={style}
        disabled={disabled}
      >
        <DropdownList
          disabled={disabled}
          options={[
            {
              label: '插入网络图片',
              value: '1',
              onClick: () => {
                setOpen(true);
              },
            },
            {
              label: (
                <Upload
                  editor={editor}
                  accept=".jpg,.jpeg,.png,.gif"
                  acceptErrMsg="支持文件格式：jpg、jpeg、png、gif格式"
                  multiple
                  beforeUpload={onImageBeforeUpload}
                  onError={(_, _a, file) => {
                    const uploadKey = (file as any).__imageUploadKey;
                    if (!uploadKey) return;
                    editor.commands.updateImageByUploadKey(uploadKey, {
                      src: undefined,
                      isError: true,
                    });
                    removeUploadProgress(editor, uploadKey);
                  }}
                  onProgress={(event, file) => {
                    const uploadKey = (file as any).__imageUploadKey;
                    if (!uploadKey) return;
                    updateUploadProgress(editor, uploadKey, event.percent);
                  }}
                  onStart={async file => {
                    const uploadKey = uuid();
                    (file as any).__imageUploadKey = uploadKey;
                    onImageStartUpload?.();
                    const { width: naturalWidth, height: naturalHeight } =
                      await getImageSizeFromFile(file);

                    const editorWidth = getEditorWidth(editor);

                    const { width, height } = calculateSize(
                      naturalWidth,
                      naturalHeight,
                      editorWidth,
                    );
                    editor
                      .chain()
                      .focus()
                      .setImage({
                        uploadKey,
                        src: URL.createObjectURL(file),
                        width,
                        height,
                      })
                      .run();
                    updateUploadProgress(editor, uploadKey, 0);
                  }}
                  onSuccess={async (res, file) => {
                    const uploadKey = (file as any).__imageUploadKey;
                    if (!uploadKey) return;

                    editor.commands.updateImageByUploadKey(uploadKey, {
                      src: res.data,
                    });
                    removeUploadProgress(editor, uploadKey);
                    onImageEndUpload?.();
                  }}
                  maxFileSize={maxFileSize}
                  customRequest={makeCustomRequest(onImageUpload)}
                >
                  上传本地图片
                </Upload>
              ),
              value: '2',
              onClick: () => {
              },
            },
          ]}
        >
          <Iconfont type="icon-image" />
        </DropdownList>
      </ToolbarItemButtonWrapper>
      <UploadNetworkImageModal
        onSubmit={data => {
          editor.chain().focus().setImage(data).run();
        }}
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
};
export default ImageButton;
