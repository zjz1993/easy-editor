import {
  type ReactElement,
  type ReactNode,
  forwardRef,
  useCallback,
  useImperativeHandle,
  useState,
} from 'react';
import { Iconfont } from '../../components';
import DropdownPanel from '../DropdownPanel/index.tsx';
import './index.scss';
import cx from 'classnames';

export type TDropDownRefProps = {
  toggleVisible: (visible: boolean) => void;
};

const Dropdown = forwardRef<
  TDropDownRefProps,
  {
    visible?: boolean;
    children: ReactElement;
    popup: ReactNode;
  }
>((props, ref) => {
  const { children, popup } = props;
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const handleVisibleChange = useCallback((isOpen: boolean) => {
    setIsOpen(isOpen);
  }, []);
  useImperativeHandle(ref, () => {
    return {
      toggleVisible: (outerVisible: boolean) => {
        setIsOpen(outerVisible);
      },
    };
  });

  return (
    <DropdownPanel
      className="easy-editor-toolbar__item"
      popup={popup}
      popupVisible={isOpen}
      onPopupVisibleChange={handleVisibleChange}
    >
      <div className="easy-editor-dropdown">
        {children}
        <div
          className={cx(
            'easy-editor-dropdown__icon',
            isOpen && 'easy-editor-dropdown__icon__open',
          )}
        >
          <Iconfont type="icon-caret-down" />
        </div>
      </div>
    </DropdownPanel>
  );
});
export default Dropdown;
