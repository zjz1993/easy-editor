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

const Bold: FC<UndoProps> = ({ className, style, title }) => {
  const { editor, disabled } = useContext(ToolbarContext);
  const btnDisabled =
    disabled || !editor.can().chain().focus().toggleBold().run();
  return (
    <ToolbarItemButtonWrapper
      intlStr="bold"
      className={className}
      style={style}
      disabled={disabled}
    >
      <Button
        isActive={editor.isActive('bold')}
        onClick={() =>
          setTextSelectionAfterChange(editor, () => {
            editor.chain().focus().toggleBold().run();
          })
        }
        disabled={btnDisabled}
      >
        <Iconfont type="icon-bold" />
      </Button>
    </ToolbarItemButtonWrapper>
  );
};
export default Bold;
