import {type FC, useCallback, useEffect, useRef, useState} from 'react';
import cx from 'classnames';

const InsertTablePanel: FC<{
  maxRows?: number;
  maxCols?: number;
  minRows?: number;
  minCols?: number;
  rows?: number;
  cols?: number;
  onEsc?: () => void;
  onClick?: (rows: number, cols: number) => void;
}> = ({
  maxRows = 10,
  maxCols = 10,
  minRows = 6,
  minCols = 6,
  onClick,
  onEsc,
}) => {
  const [rows, setRows] = useState(1);
  const [cols, setCols] = useState(1);
  const [totalRows, setTotalRows] = useState(minRows);
  const [totalCols, setTotalCols] = useState(minCols);

  const pickerRef = useRef(null);

  // 自动聚焦
  useEffect(() => {
    pickerRef.current?.focus();
  }, []);

  const handleCellChange = useCallback(
    (row: number, col: number) => {
      setRows(row);
      setCols(col);
      setTotalRows(Math.max(Math.min(row + 1, maxRows), minRows));
      setTotalCols(Math.max(Math.min(col + 1, maxCols), minCols));
    },
    [maxRows, maxCols, minRows, minCols],
  );

  const handleClick = useCallback(() => {
    onClick?.(rows, cols);
  }, [onClick, rows, cols]);

  const onKeyDown = useCallback(
    (e: { key: string; keyCode: number; stopPropagation: () => void }) => {
      if (e.key === 'Escape' || e.keyCode === 27) {
        onEsc?.();
        e.stopPropagation();
      }
    },
    [onEsc],
  );

  const getTableCells = useCallback(
    (row: number) => {
      const cells = [];
      for (let col = 0; col < totalCols; col++) {
        cells.push(
          <div
            key={col}
            className={cx('table-cell', {
              active: row < rows && col < cols,
            })}
            onFocus={() => {}}
            onMouseOver={() => handleCellChange(row + 1, col + 1)}
          />,
        );
      }
      return cells;
    },
    [rows, cols, totalCols, handleCellChange],
  );

  const getTableRows = useCallback(() => {
    const result = [];
    for (let row = 0; row < totalRows; row++) {
      result.push(
        <div key={row} className="table-row">
          {getTableCells(row)}
        </div>,
      );
    }
    return result;
  }, [totalRows, getTableCells]);

  return (
    <div
      className="kms-tb-table-picker"
      onClick={handleClick}
      onKeyDown={onKeyDown}
      ref={pickerRef}
    >
      <div className="table-content">{getTableRows()}</div>
      <div className="table-label">
        <span>{`${rows} x ${cols}`}</span>
      </div>
    </div>
  );
};
export default InsertTablePanel;
