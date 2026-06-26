import {Dropdown, IntlComponent, type TDropDownRefProps} from '@textory/editor-common';
import cx from 'classnames';
import {type FC, useContext, useRef} from 'react';
import type {TToolbarWrapperProps} from 'src/types/index.ts';
import ToolbarItemButtonWrapper from '../ToolbarItemButtonWrapper';
import ToolbarContext from '../../context/toolbarContext.ts';
import HeaderButtonDropdown from './HeaderButtonDropdown.tsx';

const headingLevels = [1, 2, 3, 4, 5, 6];

const HeaderButton: FC<TToolbarWrapperProps> = ({
  style,
  disabled,
  intlStr,
}) => {
  const { editor } = useContext(ToolbarContext);
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
        className={cx(
          'textory-toolbar__item__dropdown',
          disabled && 'dropdown-disabled',
        )}
        getPopupContainer={node => node.parentNode as HTMLElement}
        ref={ref}
        popup={
          <HeaderButtonDropdown
            onClick={() => {
              ref.current.toggleVisible(false);
            }}
          />
        }
      >
        <div>{getHeadingText()}</div>
      </Dropdown>
    </ToolbarItemButtonWrapper>
  );
};
export default HeaderButton;
