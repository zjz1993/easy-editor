import { Iconfont } from '@easy-editor/editor-common';
import { type FC, useContext } from 'react';
import ToolbarItemButtonWrapper from '../../components/toolbarItem/ToolbarItemButtonWrapper.tsx';
import ToolbarContext from '../../context/toolbarContext.ts';
import type { TToolbarWrapperProps } from '../../types/index.ts';
import { setTextSelectionAfterChange } from '../../utils/index.ts';
import { Button } from '../Button.tsx';

const Bold: FC<TToolbarWrapperProps> = ({
  intlStr,
  className,
  style,
  disabled,
}) => {
  const { editor } = useContext(ToolbarContext);
  return (
    <ToolbarItemButtonWrapper
      intlStr={intlStr}
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
        disabled={disabled}
      >
        <Iconfont type="icon-bold" />
      </Button>
    </ToolbarItemButtonWrapper>
  );
};
export default Bold;
