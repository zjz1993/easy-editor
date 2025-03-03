import { Iconfont, Popover } from '@easy-editor/editor-common';
import { type FC, useContext, useState } from 'react';
import ToolbarItemButtonWrapper from '../../components/toolbarItem/ToolbarItemButtonWrapper.tsx';
import ToolbarContext from '../../context/toolbarContext.ts';
import type { TToolbarWrapperProps } from '../../types/index.ts';
import { LinkPanelPopup } from './LinkPanel.tsx';

const LinkButton: FC<TToolbarWrapperProps> = props => {
  const { intlStr, className, style, disabled } = props;
  const { editor } = useContext(ToolbarContext);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  return (
    <ToolbarItemButtonWrapper
      intlStr={intlStr}
      className={'easy-editor-toolbar__item__btn'}
      style={style}
      disabled={disabled}
      tooltipVisible={tooltipVisible}
    >
      <Popover
        open={popoverOpen}
        onOpenChange={open => {
          if (open) {
            setTooltipVisible(!open);
          } else {
            setTooltipVisible(false);
            setPopoverOpen(false);
          }
        }}
        placement="bottom-start"
        content={
          <LinkPanelPopup
            onCancel={() => {
              setPopoverOpen(false);
            }}
          />
        }
      >
        <Iconfont
          type="icon-link"
          onClick={() => {
            setPopoverOpen(true);
          }}
          onMouseLeave={() => {
            setTooltipVisible(false);
          }}
          onMouseEnter={() => {
            setTooltipVisible(true);
          }}
        />
      </Popover>
    </ToolbarItemButtonWrapper>
  );
};
export default LinkButton;
