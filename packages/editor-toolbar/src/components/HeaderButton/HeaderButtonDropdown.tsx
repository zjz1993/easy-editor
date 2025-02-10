import { type FC, useCallback } from 'react';
import './index.scss';
import {
  BLOCK_TYPES,
  IntlComponent,
  headers,
} from '@easy-editor/editor-common/src/index.ts';
import cx from 'classnames';
import { command, option } from '../../utils/index.ts';
import { ToolBarItemDivider } from '../ToolBarItemDivider.tsx';

const HeaderButtonDropdown: FC<{ name?: string }> = props => {
  const createHeaderItem = useCallback(() => {
    const res = [];
    headers.forEach(({ keys, type, name }, index) => {
      const nameComponent = {
        [BLOCK_TYPES.P]: <div className="header-name">正文</div>,
        [BLOCK_TYPES.H]: (
          <>
            <div className="header-name">{IntlComponent.get('header')}</div>
            <div className="header-keys">
              {IntlComponent.get(keys, { option, command })}
            </div>
          </>
        ),
        [BLOCK_TYPES.HR]: <ToolBarItemDivider direction="horizontal" />,
      };
      res.push(
        <div
          key={`header_${index}`}
          className={cx(
            'easy-editor-header-dropdown__item',
            type === BLOCK_TYPES.H && `header-${name}`,
          )}
        >
          {nameComponent[type]}
        </div>,
      );
    });
    return res;
  }, []);
  return (
    <div className="easy-editor-header-dropdown">{createHeaderItem()}</div>
  );
};
export default HeaderButtonDropdown;
