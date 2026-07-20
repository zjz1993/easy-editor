import {Iconfont} from '@textory/editor-common';
import {type FC, useContext} from 'react';
import {useEditorState} from '@tiptap/react';
import ToolbarItemButtonWrapper from '../ToolbarItemButtonWrapper';
import ToolbarContext from '../../context/toolbarContext.ts';
import type {TToolbarWrapperProps} from '../../types/index.ts';
import Button from '../Button'

const Underline: FC<TToolbarWrapperProps> = ({
  intlStr,
  className,
  style,
  disabled,
}) => {
  const { editor } = useContext(ToolbarContext);
  const { isActive } = useEditorState({
    editor,
    selector: ({ editor }) => ({ isActive: editor.isActive('underline') }),
  });
  return (
    <ToolbarItemButtonWrapper
      intlStr={intlStr}
      className={className}
      style={style}
      disabled={disabled}
    >
      <Button
        isActive={isActive}
        onClick={() => {
          editor.chain().focus().toggleUnderline().run();
        }}
        disabled={disabled}
      >
        <Iconfont type="icon-underline" />
      </Button>
    </ToolbarItemButtonWrapper>
  );
};
export { Underline };
