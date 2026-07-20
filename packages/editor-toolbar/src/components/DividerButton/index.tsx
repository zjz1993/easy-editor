import {Iconfont} from '@textory/editor-common';
import {type FC, useMemo, useContext} from 'react';
import type {TToolbarWrapperProps} from 'src/types/index.ts';
import cx from 'classnames';
import {BLOCK_TYPES} from '@textory/editor-utils';
import { isInTable, isInListSelection, isNodeSelection } from '@textory/editor-utils';
import ToolbarItemButtonWrapper from '../ToolbarItemButtonWrapper';
import ToolbarContext from "../../context/toolbarContext.ts";

const DividerButton: FC<TToolbarWrapperProps> = props => {
  const { disabled, intlStr, style, editor } = props;
  const { dispatch } = useContext(ToolbarContext);
  const {state, state:{selection}} = editor;
  const calcDisabled = useMemo(() => {
    return isInTable(state) || isNodeSelection(selection) || isInListSelection(state)
  },[state, selection]);
  return (
    <>
      <ToolbarItemButtonWrapper
        intlStr={intlStr}
        className={cx(
          'textory-toolbar__item__btn',
        )}
        style={style}
        disabled={disabled || calcDisabled}
        onClick={() => {
          if (disabled || calcDisabled){
            return;
          }
          editor.chain().focus().setHorizontalRule().run()
        }}
      >
        <Iconfont
          type="divider"
        />
      </ToolbarItemButtonWrapper>
    </>
  );
};
export default DividerButton;
