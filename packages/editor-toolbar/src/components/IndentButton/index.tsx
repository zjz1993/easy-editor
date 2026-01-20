import {BLOCK_TYPES, Iconfont, INDENT_TYPES,} from '@textory/editor-common';
import {isTextSelection} from '@tiptap/core';
import {useContext} from 'react';
import Button from '../Button';
import ToolbarItemButtonWrapper from '../ToolbarItemButtonWrapper';
import ToolbarContext from '../../context/toolbarContext.ts';

function getConstant(type: keyof typeof INDENT_TYPES) {
  if (type === INDENT_TYPES.Inc) {
    return {
      tooltip: 'indent-inc',
      icon: 'indent-inc',
      navKey: 'indent-inc',
    };
  }
  return {
    tooltip: 'indent-desc',
    icon: 'indent-desc',
    navKey: 'indent-desc',
  };
}

function IndentButton(props: any) {
  const { editor } = useContext(ToolbarContext);
  const { type, disabled } = props;
  const { CLI, LI } = BLOCK_TYPES;
  const inc = type === INDENT_TYPES.Inc;
  const checkDisabled = () => {
    if (disabled) {
      return true;
    }
    if (!isTextSelection(editor.state.selection)) {
      return true;
    }
    const listItem = [CLI, LI].find(name => editor.isActive(name));
    if (listItem) {
      if (inc) {
        return !editor.can().sinkListItem(listItem);
      }
      return !editor.can().liftListItem(listItem);
    }
    return false;
  };
  const toggle = (chain: {
    sinkListItem: (arg0: string) => any;
    indent: () => any;
    liftListItem: (arg0: string) => any;
    outdent: () => any;
  }) => {
    if (type === INDENT_TYPES.Inc) {
      if (editor.isActive(CLI)) {
        return chain.sinkListItem(CLI);
      }
      if (editor.isActive(LI)) {
        return chain.sinkListItem(LI);
      }
      return chain.indent();
    }
    if (editor.isActive(CLI)) {
      return chain.liftListItem(CLI);
    }
    if (editor.isActive(LI)) {
      return chain.liftListItem(LI);
    }
    return chain.outdent();
  };
  const { tooltip, icon } = getConstant(type);
  return (
    <ToolbarItemButtonWrapper intlStr={tooltip} disabled={disabled}>
      <Button
        //isActive={editor.isActive('')}
        onClick={() => {
          toggle(editor.chain().focus()).run();
        }}
        disabled={checkDisabled()}
      >
        <Iconfont type={`icon-${icon}`} />
      </Button>
    </ToolbarItemButtonWrapper>
  );
}

export { IndentButton };
