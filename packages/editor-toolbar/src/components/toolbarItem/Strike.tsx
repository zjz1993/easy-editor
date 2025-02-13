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

const Strike: FC<UndoProps> = ({ className, style, title }) => {
  const { editor, disabled } = useContext(ToolbarContext);
  const btnDisabled =
    disabled || !editor.can().chain().focus().toggleStrike().run();
  return (
    <ToolbarItemButtonWrapper
      intlStr="strike"
      className={className}
      style={style}
      disabled={btnDisabled}
    >
      <Button
        isActive={editor.isActive('strike')}
        onClick={() => {
          editor.chain().focus().toggleStrike().run();
        }}
        disabled={btnDisabled}
      >
        <Iconfont type="icon-strike" />
      </Button>
    </ToolbarItemButtonWrapper>
  );
};
export default Strike;
