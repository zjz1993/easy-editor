import { chunk } from '@easy-editor/editor-common';
import type { FC } from 'react';
import { useContext } from 'react';
import './index.scss';
import { Iconfont } from '@easy-editor/editor-common/src/index.ts';
import ToolbarContext from '../../context/toolbarContext.ts';

export const colorArray = [
  '#222e4d',
  'rgba(0, 0, 0, 0.2)',
  'rgba(0, 0, 0, 0.4)',
  'rgba(0, 0, 0, 0.6)',
  'rgba(0, 0, 0, 0.8)',
  '#000000',
  '#FFEDEA',
  '#FFF7EB',
  '#FCFAEA',
  '#EDF6E8',
  '#EBF6FE',
  '#F0F0F8',
  '#EF3638',
  '#FA6400',
  '#FAAD14',
  '#52C41A',
  '#2579F4',
  '#7C5BE0',
];

const ColorPickerDropdown: FC = () => {
  const { editor } = useContext(ToolbarContext);
  return (
    <div className="easy-editor-color-picker">
      {chunk(colorArray, 6).map((colorTempArray, index) => {
        const array = colorTempArray.map(color => {
          return (
            <div
              className="color-item"
              key={color}
              style={{ background: color }}
              onClick={() => {
                editor.chain().focus().setColor(color).run();
              }}
            >
              {editor.isActive('textStyle', { color }) && (
                <Iconfont type="icon-gou-cu" style={{ color: 'white' }} />
              )}
            </div>
          );
        });
        return (
          <div className="easy-editor-color-picker__color_row" key={index}>
            {array}
          </div>
        );
      })}
    </div>
  );
};
export default ColorPickerDropdown;
