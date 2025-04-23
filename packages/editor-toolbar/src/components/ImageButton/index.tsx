import {DropdownList, Iconfont, IntlComponent, Tooltip, Upload,} from '@easy-editor/editor-common';
import type {FC} from 'react';
import {useContext, useState} from 'react';
import type {TToolbarWrapperProps} from 'src/types/index.ts';
import UploadNetworkImageModal from './UploadNetworkImageModal.tsx';
import ToolbarContext from '../../context/toolbarContext.ts';

const ImageButton: FC<TToolbarWrapperProps> = props => {
  const { disabled, intlStr } = props;
  const { editor } = useContext(ToolbarContext);
  const [open, setOpen] = useState(false);
  return (
    <>
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
                onChange={file => {
                  console.log('onChange触发', file);
                }}
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
        <Tooltip content={IntlComponent.get(intlStr)}>
          <Iconfont type="icon-image" />
        </Tooltip>
      </DropdownList>
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
