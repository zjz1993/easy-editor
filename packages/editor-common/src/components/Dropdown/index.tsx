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
    className?: string;
    disabled?: boolean;
    getPopupContainer?: (node: HTMLElement) => HTMLElement;
    onClick?: () => void;
  }
>((props, ref) => {
  const { onClick, getPopupContainer, disabled, children, popup, className } =
    props;
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const handleVisibleChange = useCallback(
    (isOpen: boolean) => {
      if (disabled) {
        return;
      }
      if (isOpen) {
        onClick?.();
      }
      setIsOpen(isOpen);
    },
    [disabled],
  );
  useImperativeHandle(ref, () => {
    return {
      toggleVisible: (outerVisible: boolean) => {
        if (disabled) {
          return;
        }
        setIsOpen(outerVisible);
      },
    };
  });

  return (
    <DropdownPanel
      className={cx('easy-editor-toolbar__item', className)}
      popup={popup}
      popupVisible={isOpen}
      onPopupVisibleChange={handleVisibleChange}
      getPopupContainer={getPopupContainer}
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
