import {Iconfont, MARK_TYPES, Popover} from '@easy-editor/editor-common';
import {type FC, useContext, useState} from 'react';
import ToolbarItemButtonWrapper from '../../components/toolbarItem/ToolbarItemButtonWrapper.tsx';
import ToolbarContext from '../../context/toolbarContext.ts';
import type {TToolbarWrapperProps} from '../../types/index.ts';
import {LinkPanelPopup} from './LinkPanel.tsx';

const LinkButton: FC<TToolbarWrapperProps> = props => {
  const { intlStr, className, style, disabled } = props;
  const { editor } = useContext(ToolbarContext);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  function getSelectionTextWithMarks() {
    const { from, to } = editor.state.selection;
    let text = '';
    editor.state.doc.nodesBetween(from, to, (node, pos) => {
      if (node.isText) {
        const start = Math.max(from, pos);
        const end = Math.min(to, pos + node.text.length);
        text += node.text.slice(start - pos, end - pos);
      }
    });
    return text;
  }
  const text = getSelectionTextWithMarks();

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
            text={text}
            onConfirm={({ text, href }) => {
              const { from, to } = editor.state.selection; // 保存当前选区
              const isEmptySelection = from === to;
              console.log('原来的from to', from, to);
              editor
                .chain()
                .focus()
                .insertContent({
                  type: 'text',
                  text: text,
                  marks: [
                    {
                      type: MARK_TYPES.LK,
                      attrs: { href },
                    },
                  ],
                })
                .setTextSelection(
                  isEmptySelection
                    ? to + text.length
                    : { from: to, to: to + text.length },
                )
                .unsetMark(MARK_TYPES.LK) // 确保后续输入的文字不带链接
                .run();
              setPopoverOpen(false);
            }}
            onCancel={() => setPopoverOpen(false)}
          />
        }
      >
        <Iconfont
          type="icon-link"
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
export default LinkButton;
