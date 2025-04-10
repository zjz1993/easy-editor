import classNames from 'classnames';
import type {CSSProperties, HTMLAttributes, KeyboardEvent, KeyboardEventHandler, MouseEvent, ReactNode,} from 'react';
import {forwardRef} from 'react';
import useMergedState from './useMergeState.ts';
import KeyCode from './keycode.ts';
import './index.scss';

export type SwitchChangeEventHandler = (
  checked: boolean,
  event: MouseEvent<HTMLButtonElement> | KeyboardEvent<HTMLButtonElement>,
) => void;
export type SwitchClickEventHandler = SwitchChangeEventHandler;

interface SwitchProps
  extends Omit<HTMLAttributes<HTMLButtonElement>, 'onChange' | 'onClick'> {
  className?: string;
  prefixCls?: string;
  disabled?: boolean;
  checkedChildren?: ReactNode;
  unCheckedChildren?: ReactNode;
  onChange?: SwitchChangeEventHandler;
  onKeyDown?: KeyboardEventHandler<HTMLButtonElement>;
  onClick?: SwitchClickEventHandler;
  tabIndex?: number;
  checked?: boolean;
  defaultChecked?: boolean;
  loadingIcon?: ReactNode;
  style?: CSSProperties;
  title?: string;
  styles?: { content: CSSProperties };
  classNames?: { content: string };
}

const Switch = forwardRef<HTMLButtonElement, SwitchProps>(
  (
    {
      prefixCls = 'rc-switch',
      className,
      checked,
      defaultChecked,
      disabled,
      loadingIcon,
      checkedChildren,
      unCheckedChildren,
      onClick,
      onChange,
      onKeyDown,
      styles,
      classNames: switchClassNames,
      ...restProps
    },
    ref,
  ) => {
    const [innerChecked, setInnerChecked] = useMergedState<boolean>(false, {
      value: checked,
      defaultValue: defaultChecked,
    });

    function triggerChange(
      newChecked: boolean,
      event: MouseEvent<HTMLButtonElement> | KeyboardEvent<HTMLButtonElement>,
    ) {
      let mergedChecked = innerChecked;

      if (!disabled) {
        mergedChecked = newChecked;
        setInnerChecked(mergedChecked);
        onChange?.(mergedChecked, event);
      }

      return mergedChecked;
    }

    function onInternalKeyDown(e: KeyboardEvent<HTMLButtonElement>) {
      if (e.which === KeyCode.LEFT) {
        triggerChange(false, e);
      } else if (e.which === KeyCode.RIGHT) {
        triggerChange(true, e);
      }
      onKeyDown?.(e);
    }

    function onInternalClick(e: MouseEvent<HTMLButtonElement>) {
      const ret = triggerChange(!innerChecked, e);
      // [Legacy] trigger onClick with value
      onClick?.(ret, e);
    }

    const switchClassName = classNames(prefixCls, className, {
      [`${prefixCls}-checked`]: innerChecked,
      [`${prefixCls}-disabled`]: disabled,
    });

    return (
      <button
        {...restProps}
        type="button"
        role="switch"
        aria-checked={innerChecked}
        disabled={disabled}
        className={switchClassName}
        ref={ref}
        onKeyDown={onInternalKeyDown}
        onClick={onInternalClick}
      >
        {loadingIcon}
        <span className={`${prefixCls}-inner`}>
          <span
            className={classNames(
              `${prefixCls}-inner-checked`,
              switchClassNames?.content,
            )}
            style={styles?.content}
          >
            {checkedChildren}
          </span>
          <span
            className={classNames(
              `${prefixCls}-inner-unchecked`,
              switchClassNames?.content,
            )}
            style={styles?.content}
          >
            {unCheckedChildren}
          </span>
        </span>
      </button>
    );
  },
);

export default Switch;
