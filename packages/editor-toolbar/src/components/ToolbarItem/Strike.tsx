import {Iconfont} from '@textory/editor-common';
import {type FC, useContext} from 'react';
import {useEditorState} from '@tiptap/react';
import ToolbarItemButtonWrapper from '../ToolbarItemButtonWrapper';
import ToolbarContext from '../../context/toolbarContext.ts';
import type {TToolbarWrapperProps} from '../../types/index.ts';
import Button from '../Button';

const Strike: FC<TToolbarWrapperProps> = ({
  className,
  style,
  disabled,
  intlStr,
}) => {
  const { editor } = useContext(ToolbarContext);
  const { isActive } = useEditorState({
    editor,
    selector: ({ editor }) => ({ isActive: editor.isActive('strike') }),
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
          editor.chain().focus().toggleStrike().run();
        }}
        disabled={disabled}
      >
        <Iconfont type="icon-strike" />
      </Button>
    </ToolbarItemButtonWrapper>
  );
};
export { Strike };
