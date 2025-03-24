import {
  type ReactElement,
  type ReactNode,
  forwardRef,
  useCallback,
  useImperativeHandle,
} from 'react';
import { Iconfont } from '../../components';
import DropdownPanel from '../DropdownPanel/index.tsx';
import './index.scss';
import cx from 'classnames';
import useControlledValue from '../../hooks/useControlledValue.ts';

export type TDropDownRefProps = {
  toggleVisible: (visible: boolean) => void;
};

const DropdownList = forwardRef<
  TDropDownRefProps,
  {
    visible?: boolean;
    children: ReactElement;
    className?: string;
    disabled?: boolean;
    getPopupContainer?: (node: HTMLElement) => HTMLElement;
    onVisibleChange?: (visible: boolean) => void;
    onClick?: () => void;
    options: {
      disabled?: boolean;
      icon?: ReactNode;
      label: ReactNode;
      value: string;
      onClick?: () => void;
    }[];
  }
>((props, ref) => {
  const {
    visible,
    onClick,
    getPopupContainer,
    disabled,
    children,
    className,
    onVisibleChange,
    options,
  } = props;
  const [isOpen, setIsOpen, isControlled] = useControlledValue<boolean>({
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
      !isControlled && onVisibleChange?.(tempOpen);
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
      popup={
        <div className="easy-editor-dropdown__content">
          {options.map(item => (
            <div
              className={cx(
                'easy-editor-dropdown__content__item',
                item.disabled &&
                  'easy-editor-dropdown__content__item__disabled',
              )}
              key={item.value}
              onClick={() => {
                if (item.disabled) {
                  return;
                }
                item.onClick?.();
                setIsOpen(false);
              }}
            >
              {item.icon}
              {item.label}
            </div>
          ))}
        </div>
      }
      popupVisible={isOpen}
      onPopupVisibleChange={handleVisibleChange}
      getPopupContainer={getPopupContainer}
    >
      <div
        className={cx(
          'easy-editor-dropdown',
          disabled && 'easy-editor-dropdown__disabled',
        )}
      >
        <div className="easy-editor-toolbar__item">{children}</div>
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
export default DropdownList;
