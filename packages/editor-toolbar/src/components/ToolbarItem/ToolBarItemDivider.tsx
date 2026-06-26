import classNames from 'classnames';
import type { FC } from 'react';

export type MenuBarDividerProps = {
  className?: string;
  direction?: 'horizontal' | 'vertical';
};

export const ToolBarItemDivider: FC<MenuBarDividerProps> = ({
  className,
  direction = 'vertical',
}) => {
  return (
    <span
      className={classNames(
        'textory__divider',
        className,
        `divider-${direction}`,
      )}
    />
  );
};
