import { type FC, useCallback, useContext } from 'react';
import './index.scss';
import { isUndefined } from '@easy-editor/editor-common';
import IconFont from '@easy-editor/editor-common/src/components/IconFont/index.tsx';
import {
  BLOCK_TYPES,
  IntlComponent,
  headers,
} from '@easy-editor/editor-common/src/index.ts';
import cx from 'classnames';
import ToolbarContext from '../../context/toolbarContext.ts';
import { command, option } from '../../utils/index.ts';
import { ToolBarItemDivider } from '../ToolBarItemDivider.tsx';

const HeaderButtonDropdown: FC<{ onClick?: () => void }> = props => {
  const { onClick } = props;
  const { editor } = useContext(ToolbarContext);
  const createHeaderItem = useCallback(() => {
    const res = [];
    headers.forEach(({ keys, type, name, attrs }, index) => {
      const nameComponent = {
        [BLOCK_TYPES.P]: (
          <div
            key={`header_${index}`}
            className={cx('easy-editor-header-dropdown__item')}
            onClick={() => {
              editor.chain().focus().setParagraph().run();
              onClick?.();
            }}
          >
            {editor.isActive(name) ? (
              <div className="icon-selected">
                <IconFont type="icon-gou-cu" />
              </div>
            ) : (
              <div className="icon-selected" />
            )}
            <div className="header-name">正文</div>
          </div>
        ),
        [BLOCK_TYPES.QUOTE]: <div key="quote">引用</div>,
        [BLOCK_TYPES.H]: (
          <div
            key={`header_${index}`}
            className={cx(
              'easy-editor-header-dropdown__item',
              type === BLOCK_TYPES.H && `header-${name}`,
            )}
            onClick={() => {
              editor
                .chain()
                .focus()
                .toggleHeading({ level: attrs.level })
                .run();
              onClick?.();
            }}
          >
            {editor.isActive('heading', { level: attrs.level }) ? (
              <div className="icon-selected">
                <IconFont type="icon-gou-cu" />
              </div>
            ) : (
              <div className="icon-selected" />
            )}
            <div className="header-name">
              {IntlComponent.get('header')}
              {!isUndefined(attrs) && <span>{attrs.level}</span>}
            </div>
            <div className="header-keys">
              {IntlComponent.get(keys, { option, command })}
            </div>
          </div>
        ),
        [BLOCK_TYPES.HR]: (
          <span key="divider">
            <ToolBarItemDivider direction="horizontal" />
          </span>
        ),
      };
      res.push(nameComponent[type]);
    });
    return res;
  }, []);
  return (
    <div className="easy-editor-header-dropdown">{createHeaderItem()}</div>
  );
};
export default HeaderButtonDropdown;
