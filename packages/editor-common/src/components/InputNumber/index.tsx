import type {InputNumberProps} from 'rc-input-number';
import RcInputNumber from 'rc-input-number';
import {forwardRef, useRef} from 'react';
import cx from 'classnames';

const InputNumber = forwardRef<any, InputNumberProps>((props, ref) => {
  const { className, ...otherProps } = props;
  const inputNumberRef = useRef();
  return (
    <RcInputNumber
      {...otherProps}
      ref={inputNumberRef}
      className={cx(className, 'textory-input-number')}
    />
  );
});
export default InputNumber;
