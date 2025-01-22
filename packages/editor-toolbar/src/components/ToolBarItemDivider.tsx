import classNames from 'classnames';
import type { FC } from 'react';

export type MenuBarDividerProps = {
  className?: string;
};

export const ToolBarItemDivider: FC<MenuBarDividerProps> = ({ className }) => {
  return (
    <span className={classNames('easy-editor-toolbar__divider', className)} />
  );
};
