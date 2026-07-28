import classNames from 'classnames';
import type { CSSProperties, FC, ReactNode, MouseEvent } from 'react';

export type MenuBarItemProps = {
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
  disabled?: boolean;
  onclick?: (e: MouseEvent<HTMLDivElement>) => void;
};

const ToolBarItem: FC<MenuBarItemProps> = ({
  disabled,
  className,
  style,
  children,
  onclick,
}) => {
  return (
    <div
      onClick={(e) => {
        e.preventDefault();
        if (disabled){
          return;
        }
        onclick?.(e);
      }}
      className={classNames(
        'textory-toolbar__item',
        disabled && 'disabled',
        className,
      )}
      style={style}
    >
      {children}
    </div>
  );
};
export default ToolBarItem;
