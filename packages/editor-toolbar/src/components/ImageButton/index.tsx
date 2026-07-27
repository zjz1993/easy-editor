import {DropdownList, Iconfont, Upload} from '@textory/editor-common';
import React, {type ComponentProps, type FC, useContext, useState} from 'react';
import type {TToolbarWrapperProps} from 'src/types/index.ts';
import UploadNetworkImageModal from './UploadNetworkImageModal.tsx';
import ToolbarContext from '../../context/toolbarContext.ts';
import cx from 'classnames';
import {v4 as uuid} from 'uuid';
import ToolbarItemButtonWrapper from '../ToolbarItemButtonWrapper';
import type {Editor} from '@tiptap/core';
import {removeUploadProgress, updateUploadProgress,} from '@textory/extension-image';
import type {IImageProps, IImagePropsUploadOption} from '@textory/context';

/** Minimal rc-upload customRequest option shape (avoids deep-importing types). */
type CustomRequestOption = Parameters<
  NonNullable<ComponentProps<typeof Upload>['customRequest']>
>[0];

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

/**
 * Adapt `onImageUpload` (which may return `void`, `string`, or `Promise<string>`)
 * into a rc-upload-compatible `customRequest` that always signals completion
 * via `option.onSuccess` / `option.onError`.
 *
 * - Return style: `string` / `Promise<string>` — await and call onSuccess.
 * - Callback style: `void` — assume the handler manages onSuccess/onError
 *   itself (legacy contract).
 *
 * Async rejections from the return style bubble up to Upload's outer
 * try/catch, which also forwards to `option.onError`.
 */
function makeCustomRequest(
  handler: IImageProps['onImageUpload'] | undefined,
): (option: CustomRequestOption) => void {
  return option => {
    if (!handler) return;
    const uploadOption = option as CustomRequestOption &
      IImagePropsUploadOption;
    let settled = false;
    const markSettled = () => {
      settled = true;
    };

    try {
      const ret = handler(uploadOption) as unknown;
      // Return style: string | Promise<string>
      if (typeof ret === 'string') {
        markSettled();
        uploadOption.onSuccess?.({ data: ret } as any, uploadOption.file);
      } else if (ret != null && typeof (ret as Promise<unknown>).then === 'function') {
        Promise.resolve(ret as Promise<string>).then(
          url => {
            if (settled) return;
            markSettled();
            uploadOption.onSuccess?.({ data: url } as any, uploadOption.file);
          },
          err => {
            console.log('有错误吗', err, settled);
            if (settled) return;
            markSettled();
            uploadOption.onError?.(err as Error);
          },
        );
      }
      // else void: caller owns the callback contract — do nothing.
    } catch (err) {
      if (!settled) {
        markSettled();
        uploadOption.onError?.(err as Error);
      }
    }
  };
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
