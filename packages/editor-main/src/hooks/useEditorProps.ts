import {useMemo} from 'react';
import {deepMerge} from '../utils/index.ts';

export function useEditorProps<P extends Record<string, any>>(
  userProps: P,
  defaultProps: Partial<P>,
): P {
  return useMemo(() => {
    return deepMerge(defaultProps as P, userProps);
  }, [userProps, defaultProps]);
}
