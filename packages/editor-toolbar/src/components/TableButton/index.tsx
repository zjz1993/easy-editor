import {Iconfont, Popover,} from '@easy-editor/editor-common';
import type {FC} from 'react';
import {useContext, useState} from 'react';
import ToolbarItemButtonWrapper from '../ToolbarItemButtonWrapper';
import ToolbarContext from '../../context/toolbarContext.ts';
import type {TToolbarWrapperProps} from '../../types/index.ts';
import InsertTablePanel from "./insertTablePanel";

const TableButton: FC<TToolbarWrapperProps> = props => {
  const { intlStr, style, disabled } = props;
  const { editor } = useContext(ToolbarContext);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  return (
    <ToolbarItemButtonWrapper
      intlStr={intlStr}
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
          <InsertTablePanel
            onClick={(rows, cols) => {
              console.log('editor', editor);
              console.log(editor.schema.nodes.tableRow.spec);
              editor
                .chain()
                .focus()
                .insertTable({ rows, cols, withHeaderRow: true })
                .run();
              setPopoverOpen(false);
            }}
          />
        }
      >
        <Iconfont
          type="icon-table"
          onClick={() => {
            if (disabled) {
              return;
            }
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
export default TableButton;
