import { BLOCK_TYPES, Iconfont } from '@easy-editor/editor-common';
import { useContext } from 'react';
import { Button } from '../../components/Button.tsx';
import ToolbarItemButtonWrapper from '../../components/toolbarItem/ToolbarItemButtonWrapper.tsx';
import ToolbarContext from '../../context/toolbarContext.ts';

function getConstants(type: keyof typeof BLOCK_TYPES) {
  let tooltip = '';
  let icon = '';
  switch (type) {
    case BLOCK_TYPES.OL:
      tooltip = 'ol';
      icon = 'ol';
      break;
    case BLOCK_TYPES.UL:
      tooltip = 'ul';
      icon = 'ul';
      break;
    case BLOCK_TYPES.CL:
      tooltip = 'check';
      icon = 'check';
      break;
    default:
      break;
  }
  return { tooltip, icon };
}

function ListButton(props: any) {
  const { editor } = useContext(ToolbarContext);
  const { type, disabled } = props;
  const { tooltip, icon } = getConstants(type);
  const isActive = editor.isActive(type);
  const toggle = (chain: {
    toggleBulletList: () => any;
    toggleOrderedList: () => any;
    toggleTaskList: () => any;
  }) => {
    if (type === BLOCK_TYPES.UL) {
      return chain.toggleBulletList();
    }
    if (type === BLOCK_TYPES.OL) {
      return chain.toggleOrderedList();
    }
    if (type === BLOCK_TYPES.CL) {
      return chain.toggleTaskList();
    }
    return chain;
  };

  //const checkDisabled = () => {
  //  if (disabled) {
  //    return true;
  //  }
  //  const { selection } = editor.state;
  //  return isNodeSelection(selection) || isCellSelection(selection);
  //};
  return (
    <ToolbarItemButtonWrapper intlStr={tooltip} disabled={disabled}>
      <Button
        isActive={isActive}
        onClick={() => {
          toggle(editor.chain().focus()).run();
        }}
        disabled={disabled}
      >
        <Iconfont type={`icon-${icon}`} />
      </Button>
    </ToolbarItemButtonWrapper>
  );
}

export default ListButton;
