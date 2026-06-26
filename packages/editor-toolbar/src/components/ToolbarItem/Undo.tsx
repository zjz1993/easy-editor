import {Iconfont} from '@textory/editor-common';
import {type FC, useContext} from 'react';
import ToolbarItemButtonWrapper from '../ToolbarItemButtonWrapper';
import ToolbarContext from '../../context/toolbarContext.ts';
import type {TToolbarWrapperProps} from '../../types/index.ts';
import Button from '../Button/index.tsx';

export const Undo: FC<TToolbarWrapperProps> = ({
  className,
  style,
  disabled,
  intlStr,
}) => {
  const { editor } = useContext(ToolbarContext);
  return (
    <ToolbarItemButtonWrapper
      intlStr={intlStr}
      className={className}
      style={style}
      disabled={disabled}
    >
      <Button
        onClick={() => {
          editor?.chain().focus().undo?.().run();
        }}
        disabled={disabled}
      >
        <Iconfont type="icon-undo" />
      </Button>
    </ToolbarItemButtonWrapper>
  );
};
