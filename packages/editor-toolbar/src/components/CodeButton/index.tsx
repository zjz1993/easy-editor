import { Iconfont } from '@easy-editor/editor-common/src/index.ts';
import type { FC } from 'react';
import { useContext } from 'react';
import ToolbarItemButtonWrapper from '../../components/toolbarItem/ToolbarItemButtonWrapper.tsx';
import ToolbarContext from '../../context/toolbarContext.ts';
import type { TToolbarWrapperProps } from '../../types/index.ts';

const CodeButton: FC<TToolbarWrapperProps> = props => {
  const { intlStr, style, disabled } = props;
  const { editor } = useContext(ToolbarContext);
  return (
    <ToolbarItemButtonWrapper
      intlStr={intlStr}
      className={'easy-editor-toolbar__item__btn'}
      style={style}
      disabled={disabled}
      // tooltipVisible={tooltipVisible}
      onClick={() => {
        editor.chain().focus().toggleCodeBlock().run();
        // setPopoverOpen(true);
      }}
    >
      <Iconfont type="icon-code" />
    </ToolbarItemButtonWrapper>
  );
};
export default CodeButton;
