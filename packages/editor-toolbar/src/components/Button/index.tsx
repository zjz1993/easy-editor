import classNames from 'classnames';
import type {MouseEvent, ReactNode} from 'react';
import {forwardRef} from 'react';

export type ButtonProps = {
  ariaLabel?: string;
  disabled?: boolean;
  isActive?: boolean;
  children: ReactNode;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  onMouseEnter?: (e: MouseEvent<HTMLButtonElement>) => void;
  onMouseLeave?: (e: MouseEvent<HTMLButtonElement>) => void;
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ disabled, isActive, children, onClick, ariaLabel }, ref) => {
    return (
      <button
        disabled={disabled}
        aria-label={ariaLabel || ''}
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
      </button>
    );
  },
);
export default Button;
