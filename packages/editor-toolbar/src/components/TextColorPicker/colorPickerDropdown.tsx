import type { FC } from 'react';
import './index.scss';
import { Iconfont } from '@easy-editor/editor-common/src/index.ts';

const colorArray = [
  '#EF3638',
  '#FA6400',
  '#FAAD14',
  '#52C41A',
  '#2579F4',
  '#7C5BE0',
];

const ColorPickerDropdown: FC = () => {
  return (
    <div className="easy-editor-color-picker">
      <div className="easy-editor-color-picker__title">字体颜色</div>
      <div className="easy-editor-color-picker__color_row">
        {colorArray.map(color => {
          return (
            <div
              className="color-item"
              key={color}
              style={{ border: `1px solid ${color}` }}
            >
              <Iconfont type="icon-font-color" />
            </div>
          );
        })}
      </div>
      <div className="easy-editor-color-picker__title">背景颜色</div>
      <div className="easy-editor-color-picker__color_row">
        {colorArray.map(color => {
          return (
            <div
              className="color-item"
              key={color}
              style={{ background: color }}
            ></div>
          );
        })}
      </div>
    </div>
  );
};
export default ColorPickerDropdown;
