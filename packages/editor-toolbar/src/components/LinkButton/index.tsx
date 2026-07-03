import {MARK_TYPES} from '@textory/editor-utils';
import {Iconfont, Dropdown} from '@textory/editor-common';
import {type FC, useContext, useState} from 'react';
import ToolbarItemButtonWrapper from '../ToolbarItemButtonWrapper';
import ToolbarContext from '../../context/toolbarContext.ts';
import type {TToolbarWrapperProps} from '../../types/index.ts';
import {LinkPanelPopup} from './LinkPanel.tsx';
import cx from "classnames";

const LinkButton: FC<TToolbarWrapperProps> = props => {
  const {intlStr, className, style, disabled} = props;
  const {editor} = useContext(ToolbarContext);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);

  function getSelectionTextWithMarks() {
    const {from, to} = editor.state.selection;
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
      className={'textory-toolbar__item__btn'}
      style={style}
      disabled={disabled}
      tooltipVisible={tooltipVisible}
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
        onVisibleChange={setPopoverOpen}
        popup={
          <LinkPanelPopup
            text={text}
            onConfirm={({text, href}) => {
              const {from, to} = editor.state.selection; // 保存当前选区
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
                      attrs: {href},
                    },
                  ],
                })
                .setTextSelection(
                  isEmptySelection
                    ? to + text.length
                    : {from: to, to: to + text.length},
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
          onClick={() => {
            setTooltipVisible(false);
          }}
          type="link"
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
export default LinkButton;
export {LinkPanelPopup};
