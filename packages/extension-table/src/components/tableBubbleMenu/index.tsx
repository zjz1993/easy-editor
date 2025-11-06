import {BubbleMenu, Iconfont, IntlComponent, Tooltip} from '@easy-editor/editor-common';
import type {Editor} from '@tiptap/core';
import {type FC, useCallback, useState} from 'react';
import type {BubbleMenuProps} from '@tiptap/react/menus';
import {
  copyTableToClipboard,
  getCellsInColumn,
  getCellsInRow,
  getSelectedCells,
  isCellSelection,
  isColumnSelected,
  isRowSelected,
  isTableSelected
} from "../utils/index.ts";
import './index.scss';

export type TableBubbleMenuProps = {
  editor: Editor;
};

export const TableBubbleMenu: FC<TableBubbleMenuProps> = ({ editor }) => {
  const [selectedState, setSelectedState] = useState<{
    rowSelected: boolean;
    columnSelected: boolean;
    tableSelected: boolean;
  }>({
    rowSelected: false,
    columnSelected: false,
    tableSelected: false,
  });
  const [selectedCells, setSelectedCells] = useState<any[]>([]);
  const shouldShow = useCallback<BubbleMenuProps['shouldShow']>(
    props => {
      const { editor, state } = props;
      if (!editor.isEditable) {
        return false;
      }

      const { $from } = state.selection;
      const cellsInColumn = getCellsInColumn(0, editor.state.selection) || [];
      let rowIndex = 0;
      const cellRowIndexMap: number[] = [];
      cellsInColumn.forEach(({ node }) => {
        const rowspan = node.attrs.rowspan || 1;
        cellRowIndexMap.push(rowIndex);
        rowIndex += rowspan;
      });
      const hasRowSelected = !!cellsInColumn.some((_cell, index) =>
        isRowSelected(cellRowIndexMap[index], editor.state.selection),
      );
      const cellsInRow = getCellsInRow(0, editor.state.selection) || [];
      let columnIndex = 0;
      const cellColumnIndexMap: number[] = [];
      cellsInRow.forEach(({ node }) => {
        const colspan = node.attrs.colspan || 1;
        cellColumnIndexMap.push(columnIndex);
        columnIndex += colspan;
      });
      const hasColumnSelected = !!cellsInRow.some((_cell, index) =>
        isColumnSelected(cellColumnIndexMap[index], editor.state.selection),
      );
      const cells = getSelectedCells(editor.state.selection);
      setSelectedState({
        rowSelected: hasRowSelected,
        columnSelected: hasColumnSelected,
        tableSelected: isTableSelected(editor.state.selection),
      });
      if (Array.isArray(cells)) {
        setSelectedCells(cells);
      } else {
        setSelectedCells([]);
      }
      return isCellSelection(editor.state.selection);
    },
    [editor],
  );
  const renderDeleteBtn = () => {
    if (shouldShow) {
      if (selectedState.tableSelected) {
        return (
          <div className="easy-editor-table-menu-item">
            <Tooltip content={IntlComponent.get('table.delete.table')}>
              <div
                onClick={() => {
                  editor.chain().focus().deleteTable().run();
                }}
              >
                <Iconfont
                  type="remove"
                  className="easy-editor-table-icon-delete"
                />
              </div>
            </Tooltip>
          </div>
        );
      }
      if (selectedState.rowSelected) {
        return (
          <div className="easy-editor-table-menu-item">
            <Tooltip content={IntlComponent.get('table.delete.row')}>
              <div
                onClick={() => {
                  editor.chain().focus().deleteRow().run();
                }}
              >
                <Iconfont
                  type="remove"
                  className="easy-editor-table-icon-delete"
                />
              </div>
            </Tooltip>
          </div>
        );
      }
      if (selectedState.columnSelected) {
        return (
          <div className="easy-editor-table-menu-item">
            <Tooltip content={IntlComponent.get('table.delete.col')}>
              <div
                onClick={() => {
                  editor.chain().focus().deleteColumn().run();
                }}
              >
                <Iconfont
                  type="remove"
                  className="easy-editor-table-icon-delete"
                />
              </div>
            </Tooltip>
          </div>
        );
      }
    }
  };
  const renderSplitBtn = () => {
    if (!shouldShow) {
      return;
    }
    const canSplitCell = editor.can().splitCell?.();
    const canMergeCells = editor.can().mergeCells?.();
    const showSplitBtn =
      (selectedCells.length > 1 && canMergeCells) || canSplitCell;
    if (!selectedState.tableSelected && showSplitBtn) {
      return (
        <div className="easy-editor-table-menu-item">
          <Tooltip content={canMergeCells ? '合并单元格' : '拆分单元格'}>
            <Iconfont
              type={canSplitCell ? 'icon-unmerge' : 'icon-merge'}
              onClick={() => {
                if (!canSplitCell) {
                  editor.chain().focus().mergeCells().run();
                } else {
                  editor.chain().focus().splitCell().run();
                }
              }}
            />
          </Tooltip>
        </div>
      );
    }
    return null;
  };
  const renderSelectTableBtn = () => {
    if (selectedState.tableSelected) {
      return (
        <div className="easy-editor-table-menu-item">
          <Tooltip content="选中表格">
            <div>选中</div>
          </Tooltip>
        </div>
      );
    }
  };
  const renderCopyTableBtn = () => {
    if (selectedState.tableSelected) {
      return (
        <div className="easy-editor-table-menu-item">
          <Tooltip content={IntlComponent.get('table.copy.table')}>
            <Iconfont
              type="copy"
              onClick={async () => {
                await copyTableToClipboard(editor.view);
              }}
            />
          </Tooltip>
        </div>
      );
    }
  };
  return (
    <BubbleMenu
      editor={editor}
      shouldShow={shouldShow}
      className="easy-editor-table-menu"
    >
      {renderCopyTableBtn()}
      {renderSelectTableBtn()}
      {renderSplitBtn()}
      {renderDeleteBtn()}
    </BubbleMenu>
  );
};
