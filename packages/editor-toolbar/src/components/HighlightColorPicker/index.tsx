import {Dropdown, Iconfont} from '@textory/editor-common';
import type {FC} from 'react';
import {useContext} from 'react';
import ToolbarItemButtonWrapper from '../ToolbarItemButtonWrapper';
import cx from 'classnames';
import type {TToolbarWrapperProps} from '../../types/index.ts';
import ToolbarContext from '../../context/toolbarContext.ts';
import HighlightPickerDropdown, {colorArray} from './highlightPickerDropdown.tsx';

const HighlightColorPicker: FC<TToolbarWrapperProps> = ({
  style,
  intlStr,
  disabled,
}) => {
  const { editor } = useContext(ToolbarContext);
  const getActiveColor = () => {
    const res = colorArray.find(color =>
      editor.isActive('highlight', { color }),
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
        popup={<HighlightPickerDropdown />}
      >
        <div className="toolbar-color-btn">
          <Iconfont type="fill" />
          <div
            className="toolbar-color-btn__color"
            style={{ background: activeColor }}
          />
        </div>
      </Dropdown>
    </ToolbarItemButtonWrapper>
  );
};
export default HighlightColorPicker;
