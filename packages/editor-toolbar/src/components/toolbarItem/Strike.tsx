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
  return (
    <ToolbarItemButtonWrapper
      intlStr="strike"
      className={className}
      style={style}
    >
      <Button
        isActive={editor.isActive('strike')}
        onClick={() => {
          editor.chain().focus().toggleStrike().run();
        }}
        disabled={
          disabled || !editor.can().chain().focus().toggleStrike().run()
        }
      >
        <Iconfont type="icon-strike" />
      </Button>
    </ToolbarItemButtonWrapper>
  );
};
export default Strike;
