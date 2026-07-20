import {DropdownList, Iconfont, Upload} from '@textory/editor-common';
import {type FC, useContext, useState} from 'react';
import type {TToolbarWrapperProps} from 'src/types/index.ts';
import UploadNetworkImageModal from './UploadNetworkImageModal.tsx';
import ToolbarContext from '../../context/toolbarContext.ts';
import cx from 'classnames';
import {v4 as uuid} from 'uuid';
import ToolbarItemButtonWrapper from '../ToolbarItemButtonWrapper';
import type {Editor} from '@tiptap/core';
import {removeUploadProgress, updateUploadProgress,} from '@textory/extension-image';

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
  const { onImageUpload, onImageBeforeUpload, maxFileSize } = imageProps;
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
                    const id = (file as any).__imageId;
                    if (!id) return;
                    editor.commands.updateImageById(id, {
                      src: undefined,
                      isError: true,
                    });
                    removeUploadProgress(editor, id);
                  }}
                  onProgress={(event, file) => {
                    const id = (file as any).__imageId;
                    if (!id) return;
                    updateUploadProgress(editor, id, event.percent);
                  }}
                  onStart={async file => {
                    // 2️⃣ 获取真实尺寸
                    const { width: naturalWidth, height: naturalHeight } =
                      await getImageSizeFromFile(file);

                    const editorWidth = getEditorWidth(editor);

                    const { width, height } = calculateSize(
                      naturalWidth,
                      naturalHeight,
                      editorWidth,
                    );
                    const id = uuid();
                    editor
                      .chain()
                      .focus()
                      .setImage({
                        id,
                        src: URL.createObjectURL(file),
                        width,
                        height,
                      })
                      .run();
                    // 把 id 挂到 file 上（关键）
                    (file as any).__imageId = id;
                    updateUploadProgress(editor, id, 0);
                  }}
                  onSuccess={async (res, file) => {
                    const id = (file as any).__imageId;
                    if (!id) return;

                    /**
                     * const previewSrc = node.attrs.src;
                     * URL.revokeObjectURL(previewSrc);
                     * */

                    editor.commands.updateImageById(id, {
                      src: res.data,
                    });
                    removeUploadProgress(editor, id);
                  }}
                  maxFileSize={maxFileSize}
                  customRequest={onImageUpload}
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
