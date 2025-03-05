import classNames from 'classnames';
import type { CSSProperties, FC, ReactNode } from 'react';

export type MenuBarItemProps = {
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
  disabled?: boolean;
  onclick?: () => void;
};

const ToolBarItem: FC<MenuBarItemProps> = ({
  disabled,
  className,
  style,
  children,
  onclick,
}) => {
  return (
    <span
      onClick={onclick}
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
