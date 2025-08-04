import type {CSSProperties, FC} from 'react';
import Button from '../Button';
import ToolbarItemButtonWrapper from '../ToolbarItemButtonWrapper';
import {Iconfont} from '@easy-editor/editor-common';

export interface ToolbarButtonProps {
  intlStr?: string;
  className?: string;
  style?: CSSProperties;
  disabled?: boolean;
  isActive?: boolean;
  onClick?: () => void;
  icon?: string;
}

const ToolbarButton: FC<ToolbarButtonProps> = props => {
  const { icon, intlStr, className, style, disabled, isActive, onClick } =
    props;
  return (
    <ToolbarItemButtonWrapper
      intlStr={intlStr}
      className={className}
      style={style}
      disabled={disabled}
    >
      <Button isActive={isActive} onClick={onClick} disabled={disabled}>
        <Iconfont type={icon} />
      </Button>
    </ToolbarItemButtonWrapper>
  );
};
export default ToolbarButton;
