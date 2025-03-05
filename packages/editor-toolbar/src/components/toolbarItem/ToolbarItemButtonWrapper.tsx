import { IntlComponent, Tooltip } from '@easy-editor/editor-common';
import type { CSSProperties, FC, ReactElement } from 'react';
import { command, option } from '../../utils/index.ts';
import ToolBarItem from '../ToolBarItem.tsx';

const ToolbarItemButtonWrapper: FC<{
  intlStr: string;
  children: ReactElement;
  className?: string;
  style?: CSSProperties;
  disabled?: boolean;
  tooltipVisible?: boolean;
  onClick?: () => void;
}> = props => {
  const {
    onClick,
    tooltipVisible,
    children,
    intlStr,
    className,
    style,
    disabled,
  } = props;
  return (
    <ToolBarItem
      onclick={onClick}
      className={className}
      style={style}
      disabled={disabled}
    >
      <Tooltip
        content={IntlComponent.get(intlStr, { command, option })}
        open={tooltipVisible}
      >
        {children}
      </Tooltip>
    </ToolBarItem>
  );
};
export default ToolbarItemButtonWrapper;
