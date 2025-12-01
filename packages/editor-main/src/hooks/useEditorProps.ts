import {useMemo} from 'react';
import {deepMerge} from '../utils/index.ts';

export function useEditorProps<P extends Record<string, any>>(
  userProps: P,
  defaultProps: Partial<P>,
) {
  return useMemo(() => {
    const result: any = {};

    for (const key in defaultProps) {
      result[key] = deepMerge(defaultProps[key], userProps[key] || {});
    }

    return {
      ...userProps,
      ...result, // 覆盖默认 props
    };
  }, [userProps, defaultProps]);
}
