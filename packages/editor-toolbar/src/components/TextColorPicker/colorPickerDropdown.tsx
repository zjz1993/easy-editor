import {Iconfont, PRESET_COLORS} from '@textory/editor-common';
import {chunk} from 'lodash-es';
import type {FC} from 'react';
import {useContext} from 'react';
import {useEditorState} from '@tiptap/react';
import ToolbarContext from '../../context/toolbarContext.ts';

const ColorPickerDropdown: FC = () => {
  const { editor } = useContext(ToolbarContext);
  const { activeColors } = useEditorState({
    editor,
    selector: ({ editor }) => ({
      activeColors: PRESET_COLORS.filter(color =>
        editor.isActive('textStyle', { color }),
      ),
    }),
  });
  const isActive = (color: string) => activeColors?.includes(color) ?? false;
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
              {isActive(color) && (
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
