import {Iconfont} from '@textory/editor-common';
import {type FC, useContext} from 'react';
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
  return (
    <ToolbarItemButtonWrapper
      intlStr={intlStr}
      className={className}
      style={style}
      disabled={disabled}
    >
      <Button
        isActive={editor.isActive('strike')}
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
