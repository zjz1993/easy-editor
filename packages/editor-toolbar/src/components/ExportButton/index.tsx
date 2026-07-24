import type {FC} from "react";
import {useState} from 'react';
import ToolbarItemButtonWrapper from "../../components/ToolbarItemButtonWrapper/index.tsx";
import cx from "classnames";
import type {ExportProps} from '@textory/context';
import {DropdownList, Iconfont} from '@textory/editor-common';
import type {TToolbarWrapperProps} from "../../types/index.ts";
import {exportWORD} from "@textory/extension-export";

export type ExportButtonProps = TToolbarWrapperProps & {
  exportProps: Partial<ExportProps>
}

const ExportButton:FC<ExportButtonProps> = ({exportProps = {}, editor,intlStr, style, disabled}) => {
  const {watermark, onExportStarted, onExportComplete, onExportFailed} = exportProps
  const [tooltipVisible, setTooltipVisible] = useState(false);

  return (
    <ToolbarItemButtonWrapper
      intlStr={intlStr}
      className={cx(
        'textory-toolbar__item__btn',
        'textory-toolbar__item__dropdown',
      )}
      style={style}
      disabled={disabled}
      tooltipVisible={tooltipVisible}
    >
      <DropdownList
        disabled={disabled}
        options={[
          {
            // disabled: !editor.can().chain().focus().toggleCodeBlock({language:'text'})?.().run(),
            label: '导出为WORD',
            value: '1',
            onClick: async () => {
              await exportWORD({
                watermark,
                data: {
                  // 从 editor.storage.docMeta 读取用户在 DocTitle 里输入的标题
                  title: editor?.storage.docMeta?.title ?? '',
                  content: editor?.getJSON(),
                },
                onExportStarted,
                onExportComplete,
                onExportFailed,
              });
            },
          },
        ]}
      >
        <Iconfont
          onClick={() => {
            setTooltipVisible(false);
          }}
          type="daochu"
          onMouseLeave={() => {
            setTooltipVisible(false);
          }}
          onMouseEnter={() => {
            setTooltipVisible(true);
          }}
        />
      </DropdownList>
    </ToolbarItemButtonWrapper>
  );
}
export default ExportButton
