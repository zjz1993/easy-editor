import {BubbleMenu, Dropdown, Iconfont, IntlComponent, PRESET_COLORS, Tooltip,} from '@textory/editor-common';
import type {Editor} from '@tiptap/core';
import {CellSelection} from '@tiptap/pm/tables';
import {type FC, useCallback, useState} from 'react';
import type {BubbleMenuProps} from '@tiptap/react/menus';
import {
  copyTableToClipboard,
  type CustomTableMap,
  equalizeWidth,
  getCellsInColumn,
  getCellsInRow,
  getSelectedCells,
  isCellSelection,
  isColumnSelected,
  isRowSelected,
  isTableSelected,
  shouldShowTableMenu
} from '../utils/index.ts';

// 把数组按 size 切块，避免引入 lodash-es 依赖
const chunk = <T,>(arr: T[], size: number): T[][] => {
  const res: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    res.push(arr.slice(i, i + size));
  }
  return res;
};

const CellBackgroundDropdown: FC<{ editor: Editor }> = ({ editor }) => {
  const [open, setOpen] = useState(false);
  // 取当前选中单元格的背景色，用于色条展示和色板勾选标记
  const cells = getSelectedCells(editor.state.selection) || [];
  const firstBg = (cells[0]?.node.attrs as { background?: string | null })?.background;
  const activeColor = firstBg || '#222e4d';
  return (
    <Dropdown
      visible={open}
      onVisibleChange={setOpen}
      showIcon={false}
      popup={
        <div className="textory-color-picker">
          <div
            className="textory-color-picker-default-btn"
            onClick={() => {
              editor.chain().focus().unsetCellBackground().run();
              setOpen(false);
            }}
          >
            {IntlComponent.get('common.reset')}
          </div>
          {chunk(PRESET_COLORS, 6).map((row, i) => (
            <div className="textory-color-picker__color_row" key={i}>
              {row.map(color => (
                <div
                  className="color-item"
                  key={color}
                  style={{ background: color }}
                  onClick={() => {
                    editor.chain().focus().setCellBackground(color).run();
                    setOpen(false);
                  }}
                >
                  {firstBg === color && (
                    <Iconfont type="icon-gou-cu" style={{ color: 'white' }} />
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      }
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 4px',
          height: '100%',
        }}
      >
        <Iconfont type="fill" />
        <span
          style={{
            display: 'block',
            width: 16,
            height: 3,
            marginTop: 2,
            background: activeColor,
          }}
        />
      </div>
    </Dropdown>
  );
};

export type TableBubbleMenuProps = {
  editor: Editor;
};

export const TableBubbleMenu: FC<TableBubbleMenuProps> = ({ editor }) => {
  const [selectedState, setSelectedState] = useState<{
    rowSelected: boolean;
    columnSelected: CustomTableMap[];
    tableSelected: boolean;
  }>({
    rowSelected: false,
    columnSelected: [],
    tableSelected: false,
  });
  const [selectedCells, setSelectedCells] = useState<any[]>([]);
  const shouldShow = useCallback<BubbleMenuProps['shouldShow']>(
    props => {
      const { editor, state, from, to, view } = props;
      if (!editor.isEditable) {
        return false;
      }

      // 菜单只在 CellSelection 下展示。tiptap v3 的 bubble menu 对折叠光标
      // （打字）不做防抖，shouldShow 会在每个事务同步执行，因此必须在
      // getCellsInColumn 等整表遍历之前提前返回，否则大表格内打字每键都是 O(行数)。
      if (!(state.selection instanceof CellSelection)) {
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
      const columnSelected = cellsInRow.filter((_cell, index) =>
        isColumnSelected(cellColumnIndexMap[index], editor.state.selection),
      );

      const cells = getSelectedCells(editor.state.selection);
      setSelectedState({
        rowSelected: hasRowSelected,
        columnSelected,
        tableSelected: isTableSelected(editor.state.selection),
      });
      if (Array.isArray(cells)) {
        setSelectedCells(cells);
      } else {
        setSelectedCells([]);
      }
      const res = shouldShowTableMenu({ editor, state, view, from, to });
      return res;
    },
    [editor],
  );
  const renderDeleteBtn = () => {
    if (shouldShow) {
      if (selectedState.tableSelected) {
        return (
          <div className="textory-table-menu-item">
            <Tooltip content={IntlComponent.get('table.delete.table')}>
              <div
                onClick={() => {
                  editor.chain().focus().deleteTable().run();
                }}
              >
                <Iconfont
                  type="remove"
                  className="textory-table-icon-delete"
                />
              </div>
            </Tooltip>
          </div>
        );
      }
      if (selectedState.rowSelected) {
        return (
          <div className="textory-table-menu-item">
            <Tooltip content={IntlComponent.get('table.delete.row')}>
              <div
                onClick={() => {
                  editor.chain().focus().deleteRow().run();
                }}
              >
                <Iconfont
                  type="remove"
                  className="textory-table-icon-delete"
                />
              </div>
            </Tooltip>
          </div>
        );
      }
      if (selectedState.columnSelected.length > 0) {
        return (
          <div className="textory-table-menu-item">
            <Tooltip content={IntlComponent.get('table.delete.col')}>
              <div
                onClick={() => {
                  editor.chain().focus().deleteColumn().run();
                }}
              >
                <Iconfont
                  type="remove"
                  className="textory-table-icon-delete"
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
        <div className="textory-table-menu-item">
          <Tooltip content={canMergeCells ? IntlComponent.get('table.cell.merge') : IntlComponent.get('table.cell.split')}>
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
  //const renderSelectTableBtn = () => {
  //  if (selectedState.tableSelected) {
  //    return (
  //      <div className="textory-table-menu-item">
  //        <Tooltip content="均分">
  //          <div
  //            onClick={() => {
  //              equalizeWidth(editor.view);
  //            }}
  //          >
  //            均分
  //          </div>
  //        </Tooltip>
  //      </div>
  //    );
  //  }
  //};
  const renderCellBackgroundBtn = () => {
    // 选中任意单元格（含单选 / 多选 / 行 / 列 / 整表）时都显示
    if (!isCellSelection(editor.state.selection)) return null;
    return (
      <div className="textory-table-menu-item">
        <Tooltip content={IntlComponent.get('highlight')}>
          <CellBackgroundDropdown editor={editor} />
        </Tooltip>
      </div>
    );
  };
  const renderEqualizeColumnBtn = () => {
    if (selectedState.columnSelected.length >= 2) {
      return (
        <div className="textory-table-menu-item">
          <Tooltip content={IntlComponent.get('table.toolbar.junfen')}>
            <div
              onClick={() => {
                const startPos = selectedState.columnSelected.map(
                  item => item.pos,
                );
                equalizeWidth(editor.view, startPos);
              }}
            >
              <Iconfont type="junfenliekuan" />
            </div>
          </Tooltip>
        </div>
      );
    }
  };
  const renderCopyTableBtn = () => {
    if (selectedState.tableSelected) {
      return (
        <div className="textory-table-menu-item">
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
      className="textory-table-menu"
    >
      {renderCellBackgroundBtn()}
      {renderEqualizeColumnBtn()}
      {renderCopyTableBtn()}
      {/*{renderSelectTableBtn()}*/}
      {renderSplitBtn()}
      {renderDeleteBtn()}
    </BubbleMenu>
  );
};
