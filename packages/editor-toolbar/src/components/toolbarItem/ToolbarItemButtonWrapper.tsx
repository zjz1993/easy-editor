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
}> = props => {
  const { children, intlStr, className, style, disabled } = props;
  return (
    <ToolBarItem className={className} style={style} disabled={disabled}>
      <Tooltip content={IntlComponent.get(intlStr, { command, option })}>
        {children}
      </Tooltip>
    </ToolBarItem>
  );
};
export default ToolbarItemButtonWrapper;
