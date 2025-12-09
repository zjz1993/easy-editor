import type {FC} from 'react';
import {InputNumber, useControlledValue} from '@easy-editor/editor-common';
import ToolbarButton from '../src/components/ToolbarButton';
import type {AlignType} from '@easy-editor/context';

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
  const [width, setWidth] = useControlledValue<number>({
    value: defaultWidth,
    defaultValue: 1,
    // onChange: onOpenChange,
  });
  console.log('defaultWidth是', defaultWidth);
  return (
    <div className="easy-editor-image-toolbar">
      <div className="easy-editor-image-toolbar-item easy-editor-image-toolbar-input-item">
        <span>宽：</span>
        <InputNumber
          suffix="px"
          min={1}
          value={width}
          onChange={value => {
            setWidth(value as number);
            onWidthChange(value as number);
          }}
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
