import { Dropdown, Iconfont } from '@easy-editor/editor-common/src/index.ts';
import type { FC } from 'react';
import ToolbarItemButtonWrapper from '../toolbarItem/ToolbarItemButtonWrapper.tsx';
import './index.scss';
import ColorPickerDropdown from './colorPickerDropdown.tsx';

const TextColorPicker: FC = () => {
  return (
    <Dropdown
      // disabled={disabled}
      //className={cx('easy-editor-toolbar__item__dropdown')}
      // getPopupContainer={triggerNode => triggerNode.parentElement}
      popup={<ColorPickerDropdown />}
    >
      <ToolbarItemButtonWrapper intlStr="header">
        <div className="toolbar-color-btn">
          <Iconfont type="icon-font-color" />
          <div className="toolbar-color-btn__color" />
        </div>
      </ToolbarItemButtonWrapper>
    </Dropdown>
  );
};
export default TextColorPicker;
