import { Dropdown } from '@easy-editor/editor-common/src/index.ts';
import type { FC } from 'react';
import ToolbarItemButtonWrapper from '../../components/toolbarItem/ToolbarItemButtonWrapper.tsx';
import HeaderButtonDropdown from './HeaderButtonDropdown.tsx';

const HeaderButton: FC = () => {
  return (
    <Dropdown popup={<HeaderButtonDropdown />}>
      <ToolbarItemButtonWrapper intlStr="header">
        <div>123</div>
      </ToolbarItemButtonWrapper>
    </Dropdown>
  );
};
export default HeaderButton;
