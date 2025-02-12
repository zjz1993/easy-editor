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

const Underline: FC<UndoProps> = ({ className, style, title }) => {
  const { editor, disabled } = useContext(ToolbarContext);
  return (
    <ToolbarItemButtonWrapper
      intlStr="underline"
      className={className}
      style={style}
    >
      <Button
        isActive={editor.isActive('underline')}
        onClick={() => {
          editor.chain().focus().toggleUnderline().run();
        }}
        disabled={
          disabled || !editor.can().chain().focus().toggleUnderline().run()
        }
      >
        <Iconfont type="icon-underline" />
      </Button>
    </ToolbarItemButtonWrapper>
  );
};
export default Underline;
