import type {FC} from 'react';
import {Iconfont, IntlComponent, Tooltip} from '@textory/editor-common';
import cx from 'classnames';

interface IToolbarButtonProps {
  onClick?: () => void;
  tooltip?: string;
  disabled?: boolean;
  className?: string;
  iconClassName?: string;
  isActive?: boolean;
  icon?: string;
}

const ToolbarButton: FC<IToolbarButtonProps> = props => {
  const {
    iconClassName,
    onClick,
    tooltip,
    disabled,
    className,
    isActive,
    icon,
  } = props;
  return (
    <div
      className={cx(
        className,
        isActive && 'textory-image-toolbar-item-active',
        'textory-image-toolbar-item textory-image-toolbar-item-width-fix',
      )}
      onClick={() => {
        if (disabled) {
          return;
        }
        onClick?.();
      }}
    >
      <Tooltip content={IntlComponent.get(tooltip)}>
        <Iconfont type={icon} className={iconClassName} />
      </Tooltip>
    </div>
  );
};
export default ToolbarButton;
