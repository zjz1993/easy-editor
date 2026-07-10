import {Iconfont, PRESET_COLORS} from '@textory/editor-common';
import {chunk} from 'lodash-es';
import type {FC} from 'react';
import {useContext} from 'react';
import ToolbarContext from '../../context/toolbarContext.ts';

const ColorPickerDropdown: FC = () => {
  const { editor } = useContext(ToolbarContext);
  return (
    <div className="textory-color-picker">
      {chunk(PRESET_COLORS, 6).map((colorTempArray, index) => {
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
          <div className="textory-color-picker__color_row" key={index}>
            {array}
          </div>
        );
      })}
    </div>
  );
};
export default ColorPickerDropdown;
