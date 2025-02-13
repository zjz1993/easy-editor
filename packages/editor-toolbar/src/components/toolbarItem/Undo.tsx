import { Iconfont } from '@easy-editor/editor-common';
import { type CSSProperties, type FC, useContext } from 'react';
import ToolbarItemButtonWrapper from '../../components/toolbarItem/ToolbarItemButtonWrapper.tsx';
import ToolbarContext from '../../context/toolbarContext.ts';
import { Button } from '../Button.tsx';

export type UndoProps = {
  className?: string;
  style?: CSSProperties;
  title?: string;
};

export const Undo: FC<UndoProps> = ({ className, style, title }) => {
  const { editor, disabled } = useContext(ToolbarContext);
  const btnDisabled = disabled || !editor.can().chain().focus().undo?.().run();
  return (
    <ToolbarItemButtonWrapper
      intlStr="toolbar.undo"
      className={className}
      style={style}
      disabled={btnDisabled}
    >
      <Button
        onClick={() => {
          editor?.chain().focus().undo?.().run();
        }}
        disabled={btnDisabled}
      >
        <Iconfont type="icon-undo" />
      </Button>
    </ToolbarItemButtonWrapper>
  );
};
