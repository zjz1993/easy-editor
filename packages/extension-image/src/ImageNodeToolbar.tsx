import './index.scss';
import type {FC} from 'react';
import {Iconfont, InputNumber, IntlComponent, Tooltip,} from '@easy-editor/editor-common';

const ImageNodeToolbar: FC<{
  defaultWidth: number;
  onWidthChange: (width: number) => void;
  onRemove: () => void;
}> = props => {
  const { onRemove, defaultWidth, onWidthChange } = props;
  return (
    <div className="easy-editor-image-toolbar">
      <div className="easy-editor-image-toolbar-item easy-editor-image-toolbar-input-item">
        <span>宽：</span>
        <InputNumber
          suffix="px"
          min={1}
          defaultValue={defaultWidth}
          onChange={onWidthChange}
        />
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
