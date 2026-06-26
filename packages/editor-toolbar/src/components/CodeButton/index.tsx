import {BLOCK_TYPES, DropdownList, Iconfont, IntlComponent,} from '@textory/editor-common';
import type {FC} from 'react';
import {useContext, useState} from 'react';
import ToolbarItemButtonWrapper from '../ToolbarItemButtonWrapper';
import ToolbarContext from '../../context/toolbarContext.ts';
import type {TToolbarWrapperProps} from '../../types/index.ts';

const CodeButton: FC<TToolbarWrapperProps> = props => {
  const { intlStr, style, disabled } = props;
  const { editor } = useContext(ToolbarContext);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  return (
    <ToolbarItemButtonWrapper
      intlStr={intlStr}
      style={style}
      disabled={disabled}
      tooltipVisible={tooltipVisible}
    >
      <DropdownList
        onVisibleChange={open => {
          if (open) {
            setTooltipVisible(!open);
          } else {
            setTooltipVisible(false);
          }
        }}
        disabled={disabled}
        options={[
          {
            // disabled: !editor.can().chain().focus().toggleCodeBlock({language:'text'})?.().run(),
            label: editor.isActive(BLOCK_TYPES.CODE)
              ? IntlComponent.get('codeBlock.inline.remove')
              : IntlComponent.get('codeBlock.inline.insert'),
            value: '1',
            icon: <Iconfont type="icon-code" />,
            onClick: () => {
              editor.chain().focus().toggleCodeBlock().run();
            },
          },
          {
            disabled: !editor.can().chain().focus().toggleCode?.().run(),
            label: editor.isActive(BLOCK_TYPES.CODE_INLINE)
              ? IntlComponent.get('code.inline.remove')
              : IntlComponent.get('code.inline.insert'),
            value: '2',
            icon: <Iconfont type="icon-code-inline" />,
            onClick: () => editor?.chain().focus().toggleCode?.().run(),
          },
        ]}
      >
        <Iconfont
          type="icon-code"
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
};
export default CodeButton;
