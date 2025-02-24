import { Dropdown, Iconfont } from '@easy-editor/editor-common/src/index.ts';
import cx from 'classnames';
import type { FC } from 'react';
import { useContext } from 'react';
import ToolbarItemButtonWrapper from '../../components/toolbarItem/ToolbarItemButtonWrapper.tsx';
import ToolbarContext from '../../context/toolbarContext.ts';
import type { TToolbarWrapperProps } from '../../types/index.ts';
import AlignPopup from './alignPopup.tsx';

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
    <Dropdown
      disabled={disabled}
      className={cx(disabled && 'dropdown-disabled')}
      // ref={ref}
      popup={<AlignPopup alignArray={alignArray} />}
    >
      <ToolbarItemButtonWrapper intlStr={intlStr}>
        <Iconfont type={`icon-align-${activeAlign}`} />
      </ToolbarItemButtonWrapper>
    </Dropdown>
  );
};
export default AlignButton;
