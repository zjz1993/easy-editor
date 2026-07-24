import {Dropdown, Iconfont, PRESET_COLORS} from '@textory/editor-common';
import type {Editor} from '@tiptap/core';
import {chunk} from 'lodash-es';
import {type FC, useState} from 'react';
import {useEditorState} from '@tiptap/react';

export type ColorDropdownType = 'color' | 'highlight';

export interface ColorDropdownProps {
  editor: Editor;
  type: ColorDropdownType;
}

/**
 * 文字颜色 / 高亮颜色下拉。
 *
 * 性能：只订阅与 type 相关的 activeColors 列表，Tiptap deep-compare 跳过
 * 未变 transaction。
 */
const ColorDropdown: FC<ColorDropdownProps> = ({editor, type}) => {
  const [open, setOpen] = useState(false);
  const isColor = type === 'color';
  const {activeColors} = useEditorState({
    editor,
    selector: ({editor}) => ({
      activeColors: isColor
        ? PRESET_COLORS.filter(c => editor.isActive('textStyle', {color: c}))
        : PRESET_COLORS.filter(c => editor.isActive('highlight', {color: c})),
    }),
  });
  const activeColor =
    (isColor
      ? (editor.getAttributes('textStyle')?.color as string | undefined)
      : (editor.getAttributes('highlight')?.color as string | undefined)) ||
    '#222e4d';

  const handleApply = (color: string) => {
    if (isColor) {
      editor.chain().focus().setColor(color).run();
    } else {
      editor.chain().focus().setHighlight({color}).run();
    }
    setOpen(false);
  };
  const handleClear = () => {
    if (isColor) {
      editor.chain().focus().unsetColor().run();
    } else {
      editor.chain().focus().unsetHighlight().run();
    }
    setOpen(false);
  };
  return (
    <Dropdown
      visible={open}
      onVisibleChange={setOpen}
      showIcon={false}
      popup={
        <div className="textory-color-picker">
          <div
            className="textory-color-picker-default-btn"
            onClick={handleClear}
          >
            恢复默认
          </div>
          {chunk(PRESET_COLORS, 6).map((row, i) => (
            <div className="textory-color-picker__color_row" key={i}>
              {row.map(color => (
                <div
                  className="color-item"
                  key={color}
                  style={{background: color}}
                  onClick={() => handleApply(color)}
                >
                  {activeColors?.includes(color) && (
                    <Iconfont type="icon-gou-cu" style={{color: 'white'}} />
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      }
    >
      <div
        className="textory-text-bubble__btn textory-text-bubble__btn--color"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 4px',
          height: '100%',
        }}
        title={isColor ? '文字颜色' : '高亮颜色'}
      >
        <Iconfont type={isColor ? 'icon-font-color' : 'icon-fill'} />
        <span
          style={{
            display: 'block',
            width: 16,
            height: 3,
            marginTop: 2,
            background: activeColor,
          }}
        />
      </div>
    </Dropdown>
  );
};

export default ColorDropdown;
