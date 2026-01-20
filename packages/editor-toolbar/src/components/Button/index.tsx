import classNames from 'classnames';
import type {MouseEvent, ReactNode} from 'react';
import {forwardRef} from 'react';

export type ButtonProps = {
  disabled?: boolean;
  isActive?: boolean;
  children: ReactNode;
  onClick?: (e: MouseEvent<HTMLDivElement>) => void;
  onMouseEnter?: (e: MouseEvent<HTMLDivElement>) => void;
  onMouseLeave?: (e: MouseEvent<HTMLDivElement>) => void;
};

const Button = forwardRef<HTMLDivElement, ButtonProps>(
  ({ disabled, isActive, children, onClick }, ref) => {
    return (
      <div
        ref={ref}
        onClick={e => {
          e.stopPropagation();
          if (disabled) {
            return;
          }
          onClick?.(e);
        }}
        className={classNames('textory-toolbar__item__btn', {
          'textory-toolbar__item__btn--active': isActive,
          'textory-toolbar__item__btn--disabled': disabled,
        })}
      >
        {children}
      </div>
    );
  },
);
export default Button;
