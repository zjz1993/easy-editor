import {DropdownList, Iconfont, IntlComponent, Tooltip} from "@easy-editor/editor-common/src/index.ts";
import type {FC} from "react";
import {useState} from "react";
import type {TToolbarWrapperProps} from "src/types/index.ts";
import UploadNetworkImageModal from "./UploadNetworkImageModal.tsx";

const ImageButton: FC<TToolbarWrapperProps> = props => {
  const { disabled, intlStr } = props;
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
          { label: '上传本地图片', value: '2' },
        ]}
      >
        <Tooltip content={IntlComponent.get(intlStr)}>
          <Iconfont type="icon-image" />
        </Tooltip>
      </DropdownList>
      <UploadNetworkImageModal open={open} onClose={() => setOpen(false)} />
    </>
  );
};
export default ImageButton;
