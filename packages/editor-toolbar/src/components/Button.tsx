import classNames from 'classnames';
import type { MouseEvent, ReactNode } from 'react';
import { forwardRef } from 'react';

export type ButtonProps = {
  disabled?: boolean;
  isActive?: boolean;
  children: ReactNode;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ disabled, isActive, children, onClick }, ref) => {
    return (
      <button
        ref={ref}
        onClick={e => {
          e.stopPropagation();
          if (disabled) {
            return;
          }
          onClick?.(e);
        }}
        className={classNames('easy-editor-toolbar__item__btn', {
          'easy-editor-toolbar__item__btn--active': isActive,
          'easy-editor-toolbar__item__btn--disabled': disabled,
        })}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';
