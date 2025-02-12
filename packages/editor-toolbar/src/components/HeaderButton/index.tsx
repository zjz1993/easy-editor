import type { TDropDownRefProps } from '@easy-editor/editor-common/src/components/Dropdown/index.tsx';
import {
  Dropdown,
  IntlComponent,
} from '@easy-editor/editor-common/src/index.ts';
import cx from 'classnames';
import type { FC } from 'react';
import { useContext, useRef } from 'react';
import ToolbarItemButtonWrapper from '../../components/toolbarItem/ToolbarItemButtonWrapper.tsx';
import ToolbarContext from '../../context/toolbarContext.ts';
import HeaderButtonDropdown from './HeaderButtonDropdown.tsx';

const headingLevels = [1, 2, 3, 4, 5, 6];

const HeaderButton: FC = () => {
  const { editor, disabled } = useContext(ToolbarContext);
  const ref = useRef<TDropDownRefProps>();
  const getHeadingText = () => {
    if (editor.isActive('paragraph') && !editor.isActive('blockquote')) {
      return IntlComponent.get('paragraph');
    }
    if (editor.isActive('blockquote')) {
      return IntlComponent.get('quote');
    }
    const activeLevel = headingLevels.find(level =>
      editor.isActive('heading', { level }),
    );
    if (activeLevel) {
      return IntlComponent.get('header.level', { level: activeLevel });
    }
    return IntlComponent.get('paragraph');
  };
  return (
    <Dropdown
      disabled={disabled}
      className={cx(
        'easy-editor-toolbar__item__dropdown',
        disabled && 'dropdown-disabled',
      )}
      ref={ref}
      popup={
        <HeaderButtonDropdown
          onClick={() => {
            ref.current.toggleVisible(false);
          }}
        />
      }
    >
      <ToolbarItemButtonWrapper intlStr="header">
        <div>{getHeadingText()}</div>
      </ToolbarItemButtonWrapper>
    </Dropdown>
  );
};
export default HeaderButton;
