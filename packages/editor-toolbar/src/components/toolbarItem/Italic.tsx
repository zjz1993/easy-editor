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

const Italic: FC<UndoProps> = ({ className, style, title }) => {
  const { editor, disabled } = useContext(ToolbarContext);
  return (
    <ToolbarItemButtonWrapper
      intlStr="italic"
      className={className}
      style={style}
    >
      <Button
        isActive={editor.isActive('italic')}
        onClick={() => {
          editor.chain().focus().toggleItalic().run();
        }}
        disabled={
          disabled || !editor.can().chain().focus().toggleItalic().run()
        }
      >
        <Iconfont type="icon-italic" />
      </Button>
    </ToolbarItemButtonWrapper>
  );
};
export default Italic;
