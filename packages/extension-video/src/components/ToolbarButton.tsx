import type {FC} from 'react';
import {Iconfont, IntlComponent, Tooltip} from '@textory/editor-common';
import cx from 'classnames';

/**
 * Local toolbar button used by `VideoNodeToolbar`.
 *
 * Same shape as the image extension's local ToolbarButton — kept
 * duplicated rather than shared because the styling hooks differ
 * (`textory-video-toolbar-*`). If a third caller appears, lift into
 * `@textory/editor-common`.
 */
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
        isActive && 'textory-video-toolbar-item-active',
        'textory-video-toolbar-item textory-video-toolbar-item-width-fix',
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
