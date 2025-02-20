import { Dropdown, Iconfont } from '@easy-editor/editor-common/src/index.ts';
import type { FC } from 'react';
import { useContext } from 'react';
import ToolbarItemButtonWrapper from '../toolbarItem/ToolbarItemButtonWrapper.tsx';
import './index.scss';
import type { TToolbarWrapperProps } from 'src/types/index.ts';
import ToolbarContext from '../../context/toolbarContext.ts';
import ColorPickerDropdown, { colorArray } from './colorPickerDropdown.tsx';

const TextColorPicker: FC<TToolbarWrapperProps> = ({ intlStr }) => {
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
      // disabled={disabled}
      //className={cx('easy-editor-toolbar__item__dropdown')}
      // getPopupContainer={triggerNode => triggerNode.parentElement}
      popup={<ColorPickerDropdown />}
    >
      <ToolbarItemButtonWrapper intlStr={intlStr}>
        <div
          className="toolbar-color-btn"
          //onClick={e => {
          //  e.stopPropagation();
          //  console.log('点击了');
          //  setTextSelectionAfterChange(editor, () => {
          //    editor.chain().focus().setColor('red').run();
          //  });
          //}}
        >
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
