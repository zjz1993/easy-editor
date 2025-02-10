import { IntlComponent, Tooltip } from '@easy-editor/editor-common';
import type { CSSProperties, FC, ReactElement } from 'react';
import { command, option } from '../../utils/index.ts';
import ToolBarItem from '../ToolBarItem.tsx';

const ToolbarItemButtonWrapper: FC<{
  intlStr: string;
  children: ReactElement;
  className?: string;
  style?: CSSProperties;
}> = props => {
  const { children, intlStr, className, style } = props;
  return (
    <ToolBarItem className={className} style={style}>
      <Tooltip text={IntlComponent.get(intlStr, { command, option })}>
        {children}
      </Tooltip>
    </ToolBarItem>
  );
};
export default ToolbarItemButtonWrapper;
