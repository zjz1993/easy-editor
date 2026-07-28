import {createContext} from 'react';
import type {IToolbarCommonProps} from '../types/index.ts';
import type {IFileProps, IImageProps} from '@textory/context';

const ToolbarContext = createContext<
  IToolbarCommonProps & {
    imageProps?: Partial<IImageProps>;
    fileProps?: Partial<IFileProps>;
  }
>({
  dispatch(tr): void {},
  editor: undefined,
  value: undefined,
  view: undefined,
});
export default ToolbarContext;
