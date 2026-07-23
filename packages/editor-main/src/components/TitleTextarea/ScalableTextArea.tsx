import ClassNames from 'classnames';
import { pick } from 'lodash-es';
import React, { useEffect, useRef, useState } from 'react';
import type {CSSProperties} from 'react';

const ScalableTextArea = (props: {
  className?: string;
  style?: CSSProperties;
  value: any;
  autoFocus?: boolean;
  onChange?: (e: string) => void;
  placeholder?: string;
  disabled?: boolean;
  maxLength?: number;
  onFocus?: () => void
  onBlur?: () => void
}) => {
  const { className, style, value, autoFocus } = props;
  const textAreaProps = pick(props, [
    'disabled',
    'readOnly',
    'placeholder',
    'onFocus',
    'onBlur',
    'onKeyDown',
    'onKeyUp',
    'onChange',
    'maxLength',
  ]);
  const [text, setText] = useState(value);
  const inputRef = useRef<any>();

  const cls = ClassNames('textory-scalable-textarea', className);
  const placeholderText = `${value}'\n'`
  useEffect(() => {
    setText(value);
  }, [value]);

  return (
    <div className={cls} style={style}>
      <div className="invisible-placeholder">{placeholderText}</div>
      <textarea
        ref={inputRef}
        value={text}
        autoFocus={autoFocus}
        {...textAreaProps}
        onChange={(e) => {
          const str = e.target.value;
          setText(str);
          if (textAreaProps.onChange) {
            textAreaProps.onChange(e.target.value);
          }
        }}
      />
    </div>
  );
};

export default React.memo(ScalableTextArea, (prevProps, nextProps) => {
  return prevProps.value === nextProps.value;
});
