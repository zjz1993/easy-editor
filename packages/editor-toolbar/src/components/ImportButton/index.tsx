import {useRef, useState, type FC} from 'react';
import {Iconfont} from '@textory/editor-common';
import cx from 'classnames';
import ToolbarItemButtonWrapper from '../../components/ToolbarItemButtonWrapper/index.tsx';
import type {TToolbarWrapperProps} from '../../types/index.ts';

export type ImportButtonProps = TToolbarWrapperProps & {
  /** Called when the user picks a .docx file */
  onImportFile: (file: File) => void;
};

const ImportButton: FC<ImportButtonProps> = ({
  onImportFile,
  intlStr,
  style,
  disabled,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [tooltipVisible, setTooltipVisible] = useState(false);

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept=".docx"
        style={{display: 'none'}}
        onChange={e => {
          const file = e.target.files?.[0];
          if (file) {
            onImportFile(file);
          }
          // Reset so the same file can be re-selected
          e.target.value = '';
        }}
      />
      <ToolbarItemButtonWrapper
        intlStr={intlStr}
        className={cx(
          'textory-toolbar__item__btn',
        )}
        style={style}
        disabled={disabled}
        tooltipVisible={tooltipVisible}
        onClick={() => {
          if (!disabled) {
            inputRef.current?.click();
          }
        }}
      >
        <Iconfont
          type="daoru"
          onMouseEnter={() => setTooltipVisible(true)}
          onMouseLeave={() => setTooltipVisible(false)}
        />
      </ToolbarItemButtonWrapper>
    </>
  );
};

export default ImportButton;
