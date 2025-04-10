import './index.scss';
import type {FC} from 'react';
import {Iconfont, InputNumber, IntlComponent, Tooltip} from "@easy-editor/editor-common";

const ImageNodeToolbar: FC<{ onRemove: () => void }> = props => {
  const { onRemove } = props;
  return (
    <div className="easy-editor-image-toolbar">
      <div className="easy-editor-image-toolbar-item">
        <InputNumber />
      </div>
      <div
        className="easy-editor-image-toolbar-item easy-editor-image-toolbar-item-width-fix"
        onClick={onRemove}
      >
        <Tooltip content={IntlComponent.get('delete')}>
          <Iconfont type="remove" className="icon icon-delete" />
        </Tooltip>
      </div>
    </div>
  );
};
export default ImageNodeToolbar;
