import {forwardRef, type ReactElement, type ReactNode, useCallback, useImperativeHandle,} from 'react';
import Iconfont from '../IconFont';
import DropdownPanel from '../DropdownPanel/index.tsx';
import './index.scss';
import cx from 'classnames';
import useControlledValue from '../../hooks/useControlledValue.ts';
import type {TDropDownRefProps} from "../../types/index.ts";

const Dropdown = forwardRef<
  TDropDownRefProps,
  {
    visible?: boolean;
    children: ReactElement;
    popup: ReactNode;
    className?: string;
    disabled?: boolean;
    getPopupContainer?: (node: HTMLElement) => HTMLElement;
    onVisibleChange?: (visible: boolean) => void;
    onClick?: () => void;
  }
>((props, ref) => {
  const {
    visible,
    onClick,
    getPopupContainer,
    disabled,
    children,
    popup,
    className,
    onVisibleChange,
  } = props;
  const [isOpen, setIsOpen] = useControlledValue<boolean>({
    value: visible,
    defaultValue: false,
    onChange: onVisibleChange,
  });
  const handleVisibleChange = useCallback(
    (tempOpen: boolean) => {
      if (disabled) {
        return;
      }
      if (tempOpen) {
        onClick?.();
      }
      setIsOpen(tempOpen);
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
