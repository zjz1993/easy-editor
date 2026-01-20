import {DropdownList, Iconfont, Upload,} from '@textory/editor-common';
import {type FC, useContext, useRef, useState} from 'react';
import type {TToolbarWrapperProps} from 'src/types/index.ts';
import UploadNetworkImageModal from './UploadNetworkImageModal.tsx';
import ToolbarContext from '../../context/toolbarContext.ts';
import cx from "classnames";
import ToolbarItemButtonWrapper from '../ToolbarItemButtonWrapper';

const ImageButton: FC<TToolbarWrapperProps> = props => {
  const { disabled, intlStr, style } = props;
  const { editor, imageProps } = useContext(ToolbarContext);
  const [open, setOpen] = useState(false);
  const insertPosRef = useRef<number | undefined>();
  const { onImageUpload } = imageProps;

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
                  accept=".jpg,.jpeg,.png,.gif"
                  acceptErrMsg="支持文件格式：jpg、jpeg、png、gif格式"
                  multiple
                  onError={() => {
                    console.log('onError触发');
                  }}
                  onProgress={event => {
                    console.log('onProgress', event);
                  }}
                  onStart={file => {
                    const pos = editor.state.selection.from;
                    editor
                      .chain()
                      .focus()
                      .setImage({ tempFile: file, loading: true, src: '' })
                      .run();
                    insertPosRef.current = pos;
                  }}
                  onSuccess={(res, file) => {
                    console.log('onSuccess触发', res);
                    const pos = insertPosRef.current;
                    const tr = editor.state.tr;

                    const node = editor.state.doc.nodeAt(pos);
                    if (!node || node.type.name !== 'image') return;

                    editor.view.dispatch(
                      tr.setNodeMarkup(pos, undefined, {
                        ...node.attrs,
                        src: res.data,
                        loading: false,
                        tempFile: null,
                      }),
                    );
                    insertPosRef.current = undefined;
                  }}
                  customRequest={onImageUpload}
                >
                  上传本地图片
                </Upload>
              ),
              value: '2',
              onClick: () => {
                console.log('触发点击了');
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
