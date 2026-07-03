import {Dropdown, Iconfont,} from '@textory/editor-common';
import type {FC} from 'react';
import {useContext, useState} from 'react';
import ToolbarItemButtonWrapper from '../ToolbarItemButtonWrapper';
import ToolbarContext from '../../context/toolbarContext.ts';
import type {TToolbarWrapperProps} from '../../types/index.ts';
import InsertTablePanel from "./insertTablePanel";
import cx from "classnames";

const TableButton: FC<TToolbarWrapperProps> = props => {
  const {intlStr, style, disabled} = props;
  const {editor} = useContext(ToolbarContext);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  return (
    <ToolbarItemButtonWrapper
      intlStr={intlStr}
      style={style}
      disabled={disabled}
      tooltipVisible={tooltipVisible}
      className='textory-toolbar__item__btn'
    >
      <Dropdown
        visible={popoverOpen}
        showIcon={false}
        disabled={disabled}
        className={cx(
          'textory-toolbar__item__dropdown',
          disabled && 'dropdown-disabled',
        )}
        getPopupContainer={node => node.parentNode as HTMLElement}
        popupAlign={{points: ['tr', 'br']}}
        onVisibleChange={setPopoverOpen}
        popup={
          <InsertTablePanel
            onClick={(rows, cols) => {
              editor
                .chain()
                .focus()
                .insertTable({rows, cols, withHeaderRow: true})
                .run();
              setPopoverOpen(false);
            }}
          />
        }
      >
        <Iconfont
          onClick={() => {
            setTooltipVisible(false);
          }}
          type="icon-table"
          onMouseLeave={() => {
            setTooltipVisible(false);
          }}
          onMouseEnter={() => {
            setTooltipVisible(true);
          }}
        />
      </Dropdown>
    </ToolbarItemButtonWrapper>
  );
};
export default TableButton;
