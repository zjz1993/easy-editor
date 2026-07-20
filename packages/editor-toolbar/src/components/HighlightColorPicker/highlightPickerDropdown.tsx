import {Iconfont, PRESET_COLORS} from '@textory/editor-common';
import {chunk} from 'lodash-es';
import type {FC} from 'react';
import {useContext} from 'react';
import {useEditorState} from '@tiptap/react';
import ToolbarContext from '../../context/toolbarContext.ts';

const HighlightPickerDropdown: FC = () => {
  const { editor } = useContext(ToolbarContext);
  // NOTE: 现有逻辑检查的是 'textStyle'（而非 'highlight'），疑似 bug。
  // 本次性能改造只搬位置、不改行为；bug 单独记在 .ai/performance-issues.md P2-4。
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
      <div className="textory-color-picker-default-btn" onClick={() => {
        editor.chain().focus().unsetHighlight().run();
      }}>恢复默认</div>
      {chunk(PRESET_COLORS, 6).map((colorTempArray, index) => {
        const array = colorTempArray.map(color => {
          return (
            <div
              className="color-item"
              key={color}
              style={{ background: color }}
              onClick={() => {
                editor.chain().focus().setHighlight({color}).run();
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
export default HighlightPickerDropdown;
