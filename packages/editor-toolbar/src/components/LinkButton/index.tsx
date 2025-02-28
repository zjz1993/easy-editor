import { Iconfont, Popover } from '@easy-editor/editor-common';
import { type FC, useContext, useState } from 'react';
import ToolbarItemButtonWrapper from '../../components/toolbarItem/ToolbarItemButtonWrapper.tsx';
import ToolbarContext from '../../context/toolbarContext.ts';
import type { TToolbarWrapperProps } from '../../types/index.ts';

const LinkButton: FC<TToolbarWrapperProps> = props => {
  const { intlStr, className, style, disabled } = props;
  const { editor } = useContext(ToolbarContext);
  const [tooltipVisible, setTooltipVisible] = useState(undefined);
  return (
    <ToolbarItemButtonWrapper
      intlStr={intlStr}
      className={className}
      style={style}
      disabled={disabled}
      tooltipVisible={tooltipVisible}
    >
      <Popover
        onOpenChange={open => {
          if (open) {
            setTooltipVisible(!open);
          } else {
            setTooltipVisible(undefined);
          }
        }}
        placement="bottom-start"
        content={
          <div>
            <p>Custom content here</p>
            <input type="text" placeholder="Enter something" />
          </div>
        }
      >
        <Iconfont type="icon-link" />
      </Popover>
    </ToolbarItemButtonWrapper>
  );
};
export default LinkButton;
