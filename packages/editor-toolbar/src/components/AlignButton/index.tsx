import {DropdownList, Iconfont, IntlComponent, Tooltip,} from '@easy-editor/editor-common';
import type {FC} from 'react';
import {useContext} from 'react';
import ToolbarContext from '../../context/toolbarContext.ts';
import type {TToolbarWrapperProps} from '../../types/index.ts';

const AlignButton: FC<TToolbarWrapperProps> = props => {
  const { editor } = useContext(ToolbarContext);
  const { disabled, intlStr } = props;
  const alignArray = ['left', 'center', 'right'];
  const getActiveAlignBtn = () => {
    const activeAlign = alignArray.find(item =>
      editor.isActive({ textAlign: item }),
    );
    if (activeAlign) {
      return activeAlign;
    }
    return 'left';
  };
  const activeAlign = getActiveAlignBtn();
  return (
    <DropdownList
      disabled={disabled}
      options={alignArray.map(item => ({
        label: IntlComponent.get(`align.${item}`),
        value: `align_${item}`,
        icon: <Iconfont type={`icon-align-${item}`} />,
        onClick: () => {
          editor.chain().focus().setTextAlign(item).run();
        },
      }))}
    >
      <Tooltip content={IntlComponent.get(intlStr)}>
        <Iconfont type={`icon-align-${activeAlign}`} />
      </Tooltip>
    </DropdownList>
  );
};
export default AlignButton;
