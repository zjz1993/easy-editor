import {Dropdown, Iconfont} from '@textory/editor-common';
import type {FC} from 'react';
import {useContext} from 'react';
import ToolbarItemButtonWrapper from '../ToolbarItemButtonWrapper';
import cx from 'classnames';
import type {TToolbarWrapperProps} from 'src/types/index.ts';
import ToolbarContext from '../../context/toolbarContext.ts';
import ColorPickerDropdown, {colorArray} from './colorPickerDropdown.tsx';

const TextColorPicker: FC<TToolbarWrapperProps> = ({
  style,
  intlStr,
  disabled,
}) => {
  const { editor } = useContext(ToolbarContext);
  const getActiveColor = () => {
    const res = colorArray.find(color =>
      editor.isActive('textStyle', { color }),
    );
    if (res) {
      return res;
    }
    return '#222e4d';
  };
  const activeColor = getActiveColor();
  return (
    <ToolbarItemButtonWrapper
      intlStr={intlStr}
      className={cx(
        'textory-toolbar__item__btn',
        'textory-toolbar__item__dropdown',
      )}
      style={style}
      disabled={disabled}
    >
      <Dropdown
        disabled={disabled}
        className={cx(disabled && 'disabled')}
        popup={<ColorPickerDropdown />}
      >
        <div className="toolbar-color-btn">
          <Iconfont type="icon-font-color" />
          <div
            className="toolbar-color-btn__color"
            style={{ background: activeColor }}
          />
        </div>
      </Dropdown>
    </ToolbarItemButtonWrapper>
  );
};
export default TextColorPicker;
