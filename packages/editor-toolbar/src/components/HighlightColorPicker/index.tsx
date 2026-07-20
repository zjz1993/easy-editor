import {Dropdown, Iconfont, PRESET_COLORS} from '@textory/editor-common';
import type {FC} from 'react';
import {useContext} from 'react';
import {useEditorState} from '@tiptap/react';
import ToolbarItemButtonWrapper from '../ToolbarItemButtonWrapper';
import cx from 'classnames';
import type {TToolbarWrapperProps} from '../../types/index.ts';
import ToolbarContext from '../../context/toolbarContext.ts';
import HighlightPickerDropdown from './highlightPickerDropdown.tsx';

const HighlightColorPicker: FC<TToolbarWrapperProps> = ({
  style,
  intlStr,
  disabled,
}) => {
  const { editor } = useContext(ToolbarContext);
  const { activeColor } = useEditorState({
    editor,
    selector: ({ editor }) => ({
      activeColor:
        PRESET_COLORS.find(color =>
          editor.isActive('highlight', { color }),
        ) ?? '#222e4d',
    }),
  });
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
