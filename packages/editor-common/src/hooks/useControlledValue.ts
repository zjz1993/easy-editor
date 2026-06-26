import {useCallback, useState} from 'react';

// Hook 的类型定义
type UseControlledValueProps<T> = {
  value?: T; // 受控模式的值
  defaultValue?: T; // 非受控模式的默认值
  onChange?: (value: T) => void; // 受控模式的值变更回调
};
function useControlledValue<T>(
  props: UseControlledValueProps<T>,
): [T, (newValue: T) => void, boolean] {
  const { value: controlledValue, defaultValue, onChange } = props;
  // 判断是否为受控模式
  const isControlled = controlledValue !== undefined;

  // 非受控模式下的内部状态
  const [internalValue, setInternalValue] = useState<T>(
    defaultValue !== undefined ? defaultValue : (controlledValue as T),
  );

  // 统一的值
  const value = isControlled ? controlledValue : internalValue;

  // 更新值的函数
  const setValue = useCallback(
    (newValue: T) => {
      if (isControlled) {
        // 受控模式下调用外部 onChange
        onChange?.(newValue);
      } else {
        // 非受控模式下更新内部状态
        setInternalValue(newValue);
      }
    },
    [isControlled, onChange],
  );

  return [value, setValue, isControlled];
}

export default useControlledValue;
