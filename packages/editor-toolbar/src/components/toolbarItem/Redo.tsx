import { Iconfont } from '@easy-editor/editor-common';
import { type FC, useContext } from 'react';
import type { TToolbarWrapperProps } from 'src/types/index.ts';
import ToolbarItemButtonWrapper from '../../components/toolbarItem/ToolbarItemButtonWrapper.tsx';
import ToolbarContext from '../../context/toolbarContext.ts';
import { Button } from '../Button.tsx';

export const Redo: FC<TToolbarWrapperProps> = ({
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
          editor?.chain().focus().redo?.().run();
        }}
        disabled={disabled}
      >
        <Iconfont type="icon-redo" />
      </Button>
    </ToolbarItemButtonWrapper>
  );
};
