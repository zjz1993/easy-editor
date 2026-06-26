import type {AlignType} from "@textory/context";
import {DropdownList, Iconfont, IntlComponent} from '@textory/editor-common';
import type {FC} from 'react';
import {useContext} from 'react';
import ToolbarContext from '../../context/toolbarContext.ts';
import type {TToolbarWrapperProps} from '../../types/index.ts';
import cx from "classnames";
import ToolbarItemButtonWrapper from '../ToolbarItemButtonWrapper';

const AlignButton: FC<TToolbarWrapperProps> = props => {
  const { editor } = useContext(ToolbarContext);
  const { disabled, intlStr, style } = props;
  const alignArray: AlignType[] = ['left', 'center', 'right'];
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
    <ToolbarItemButtonWrapper
      intlStr={intlStr}
      className={cx(
        'textory-toolbar__item__btn',
        'textory-toolbar__item__dropdown',
      )}
      style={style}
      disabled={disabled}
    >
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
        <Iconfont type={`icon-align-${activeAlign}`} />
      </DropdownList>
    </ToolbarItemButtonWrapper>
  );
};
export default AlignButton;
