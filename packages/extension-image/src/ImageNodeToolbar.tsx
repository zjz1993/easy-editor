import './index.scss';
import type {FC} from 'react';
import {type AlignType, InputNumber} from '@easy-editor/editor-common';
import ToolbarButton from '../src/components/ToolbarButton';

const ImageNodeToolbar: FC<{
  defaultWidth: number;
  onWidthChange: (width: number) => void;
  onAlignChange: (align: AlignType) => void;
  onRemove: () => void;
  onBorder: () => void;
  hasBorder?: boolean;
  align: AlignType;
}> = props => {
  const {
    onAlignChange,
    align,
    hasBorder,
    onRemove,
    defaultWidth,
    onWidthChange,
    onBorder,
  } = props;
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
      {(['left', 'center', 'right'] as AlignType[]).map(item => (
        <ToolbarButton
          key={item}
          isActive={align === item}
          icon={`align-${item}`}
          onClick={() => {
            onAlignChange(item);
          }}
          tooltip={`align.${item}`}
        />
      ))}
      <ToolbarButton
        isActive={hasBorder}
        icon="border"
        onClick={onBorder}
        tooltip="image.border"
      />
      <ToolbarButton
        iconClassName="icon icon-delete"
        icon="remove"
        onClick={onRemove}
        tooltip="delete"
      />
    </div>
  );
};
export default ImageNodeToolbar;
