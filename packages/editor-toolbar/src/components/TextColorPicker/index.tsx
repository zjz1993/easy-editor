import {Dropdown, Iconfont} from '@easy-editor/editor-common';
import type {FC} from 'react';
import {useContext} from 'react';
import ToolbarItemButtonWrapper from '../toolbarItem/ToolbarItemButtonWrapper.tsx';
import './index.scss';
import cx from 'classnames';
import type {TToolbarWrapperProps} from 'src/types/index.ts';
import ToolbarContext from '../../context/toolbarContext.ts';
import ColorPickerDropdown, {colorArray} from './colorPickerDropdown.tsx';

const TextColorPicker: FC<TToolbarWrapperProps> = ({ intlStr, disabled }) => {
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
    <Dropdown
      disabled={disabled}
      className={cx(disabled && 'disabled')}
      // getPopupContainer={triggerNode => triggerNode.parentElement}
      popup={<ColorPickerDropdown />}
    >
      <ToolbarItemButtonWrapper intlStr={intlStr}>
        <div className="toolbar-color-btn">
          <Iconfont type="icon-font-color" />
          <div
            className="toolbar-color-btn__color"
            style={{ background: activeColor }}
          />
        </div>
      </ToolbarItemButtonWrapper>
    </Dropdown>
  );
};
export default TextColorPicker;
