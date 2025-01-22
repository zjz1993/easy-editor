import classNames from 'classnames';
import type { CSSProperties, FC, ReactNode } from 'react';

export type MenuBarItemProps = {
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
};

const ToolBarItem: FC<MenuBarItemProps> = ({ className, style, children }) => {
  return (
    <span
      className={classNames('easy-editor-toolbar__item', className)}
      style={style}
    >
      {children}
    </span>
  );
};
export default ToolBarItem;
