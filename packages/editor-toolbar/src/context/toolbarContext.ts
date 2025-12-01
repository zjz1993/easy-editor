import {createContext} from 'react';
import type {IToolbarCommonProps} from '../types/index.ts';
import type {IImageProps} from '@easy-editor/context';

const ToolbarContext = createContext<
  IToolbarCommonProps & { imageProps?: Partial<IImageProps> }
>({
  dispatch(tr): void {},
  editor: undefined,
  value: undefined,
  view: undefined,
});
export default ToolbarContext;
