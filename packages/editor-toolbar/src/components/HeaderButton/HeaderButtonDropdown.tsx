import {type FC, useCallback, useContext} from 'react';
import {BLOCK_TYPES, headers, Iconfont, IntlComponent} from '@textory/editor-common';
import cx from 'classnames';
import ToolbarContext from '../../context/toolbarContext.ts';
import {command, option} from '../../utils/index.ts';
import {ToolBarItemDivider} from '../ToolbarItem';

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
            className={cx('textory-header-dropdown__item')}
            onClick={() => {
              editor.chain().focus().setParagraph().run();
              onClick?.();
            }}
          >
            {editor.isActive('paragraph') && !editor.isActive('blockquote') ? (
              <div className="icon-selected">
                <Iconfont type="icon-gou-cu" />
              </div>
            ) : (
              <div className="icon-selected" />
            )}
            <div className="header-name">{IntlComponent.get('paragraph')}</div>
            <div className="header-keys">
              {IntlComponent.get(keys, { option, command })}
            </div>
          </div>
        ),
        [BLOCK_TYPES.QUOTE]: (
          <div
            key="header_quote"
            className={cx('textory-header-dropdown__item')}
            onClick={() => {
              editor.chain().focus().toggleBlockquote().run();
              onClick?.();
            }}
          >
            {editor.isActive('blockquote') ? (
              <div className="icon-selected">
                <Iconfont type="icon-gou-cu" />
              </div>
            ) : (
              <div className="icon-selected" />
            )}
            <div className="header-name">{IntlComponent.get('quote')}</div>
            <div className="header-keys">
              {IntlComponent.get(keys, { option, command })}
            </div>
          </div>
        ),
        [BLOCK_TYPES.H]: (
          <div
            key={`header_${index}`}
            className={cx(
              'textory-header-dropdown__item',
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
                <Iconfont type="icon-gou-cu" />
              </div>
            ) : (
              <div className="icon-selected" />
            )}
            <div className="header-name">
              {IntlComponent.get('header.level', { level: attrs.level })}
            </div>
            <div className="header-keys">
              {IntlComponent.get(keys, { option, command })}
            </div>
          </div>
        ),
        [BLOCK_TYPES.HR]: (
          <span key={`divider_${index}`}>
            <ToolBarItemDivider direction="horizontal" />
          </span>
        ),
      };
      res.push(nameComponent[type]);
    });
    return res;
  }, []);
  return (
    <div className="textory-header-dropdown">{createHeaderItem()}</div>
  );
};
export default HeaderButtonDropdown;
