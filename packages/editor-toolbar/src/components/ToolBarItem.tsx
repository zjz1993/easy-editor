import classNames from 'classnames';
import type { CSSProperties, FC, ReactNode } from 'react';

export type MenuBarItemProps = {
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
  disabled?: boolean;
};

const ToolBarItem: FC<MenuBarItemProps> = ({
  disabled,
  className,
  style,
  children,
}) => {
  return (
    <span
      className={classNames(
        'easy-editor-toolbar__item',
        disabled && 'disabled',
        className,
      )}
      style={style}
    >
      {children}
    </span>
  );
};
export default ToolBarItem;
