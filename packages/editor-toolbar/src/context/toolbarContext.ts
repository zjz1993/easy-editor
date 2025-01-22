import { createContext } from 'react';
import type { IToolbarCommonProps } from '../types/index.ts';

const ToolbarContext = createContext<IToolbarCommonProps>({
  dispatch(tr): void {},
  editor: undefined,
  value: undefined,
  view: undefined,
});
export default ToolbarContext;
