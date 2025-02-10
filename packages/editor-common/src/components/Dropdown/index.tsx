import type { FC, ReactElement, ReactNode } from 'react';
import { useCallback, useState } from 'react';
import { Iconfont } from '../../components';
import DropdownPanel from '../DropdownPanel/index.tsx';
import './index.scss';
import cx from 'classnames';

const Dropdown: FC<{ children: ReactElement; popup: ReactNode }> = props => {
  const { children, popup } = props;
  const [visible, setVisible] = useState(false);
  const handleVisibleChange = useCallback((isOpen: boolean) => {
    setVisible(isOpen);
  }, []);
  return (
    <DropdownPanel
      className="easy-editor-toolbar__item"
      popup={popup}
      onPopupVisibleChange={handleVisibleChange}
    >
      <div className="easy-editor-dropdown">
        {children}
        <div
          className={cx(
            'easy-editor-dropdown__icon',
            visible && 'easy-editor-dropdown__icon__open',
          )}
        >
          <Iconfont type="icon-caret-down" />
        </div>
      </div>
    </DropdownPanel>
  );
};
export default Dropdown;
