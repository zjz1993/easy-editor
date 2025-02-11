import type { TDropDownRefProps } from '@easy-editor/editor-common/src/components/Dropdown/index.tsx';
import { Dropdown } from '@easy-editor/editor-common/src/index.ts';
import type { FC } from 'react';
import { useRef } from 'react';
import ToolbarItemButtonWrapper from '../../components/toolbarItem/ToolbarItemButtonWrapper.tsx';
import HeaderButtonDropdown from './HeaderButtonDropdown.tsx';

const HeaderButton: FC = () => {
  const ref = useRef<TDropDownRefProps>();
  return (
    <Dropdown
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
        <div>123</div>
      </ToolbarItemButtonWrapper>
    </Dropdown>
  );
};
export default HeaderButton;
