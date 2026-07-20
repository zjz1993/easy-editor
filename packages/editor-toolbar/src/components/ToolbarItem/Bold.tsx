import {Iconfont} from '@textory/editor-common';
import {type FC, useContext} from 'react';
import {useEditorState} from '@tiptap/react';
import ToolbarItemButtonWrapper from '../ToolbarItemButtonWrapper';
import ToolbarContext from '../../context/toolbarContext.ts';
import type {TToolbarWrapperProps} from '../../types/index.ts';
import {setTextSelectionAfterChange} from '../../utils/index.ts';
import Button from '../Button';

const Bold: FC<TToolbarWrapperProps> = ({
  intlStr,
  className,
  style,
  disabled,
}) => {
  const { editor } = useContext(ToolbarContext);
  const { isActive } = useEditorState({
    editor,
    selector: ({ editor }) => ({ isActive: editor.isActive('bold') }),
  });
  return (
    <ToolbarItemButtonWrapper
      intlStr={intlStr}
      className={className}
      style={style}
      disabled={disabled}
    >
      <Button
        ariaLabel={intlStr}
        isActive={isActive}
        onClick={() =>
          setTextSelectionAfterChange(editor, () => {
            editor.chain().focus().toggleBold().run();
          })
        }
        disabled={disabled}
      >
        <Iconfont type="icon-bold" />
      </Button>
    </ToolbarItemButtonWrapper>
  );
};
export { Bold };
