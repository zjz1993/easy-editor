import { Iconfont } from '@easy-editor/editor-common';
import { type CSSProperties, type FC, useContext } from 'react';
import ToolbarItemButtonWrapper from '../../components/toolbarItem/ToolbarItemButtonWrapper.tsx';
import ToolbarContext from '../../context/toolbarContext.ts';
import { setTextSelectionAfterChange } from '../../utils/index.ts';
import { Button } from '../Button.tsx';

export type UndoProps = {
  className?: string;
  style?: CSSProperties;
  title?: string;
};

const Italic: FC<UndoProps> = ({ className, style, title }) => {
  const { editor, disabled } = useContext(ToolbarContext);
  const btnDisabled =
    disabled || !editor.can().chain().focus().toggleItalic().run();
  return (
    <ToolbarItemButtonWrapper
      intlStr="italic"
      className={className}
      style={style}
      disabled={btnDisabled}
    >
      <Button
        isActive={editor.isActive('italic')}
        onClick={() => {
          setTextSelectionAfterChange(editor, () => {
            editor.chain().focus().toggleItalic().run();
          });
        }}
        disabled={btnDisabled}
      >
        <Iconfont type="icon-italic" />
      </Button>
    </ToolbarItemButtonWrapper>
  );
};
export default Italic;
