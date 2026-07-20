import {type FC, useContext} from 'react';
import {BLOCK_TYPES, headers} from '@textory/editor-utils';
import {Iconfont, IntlComponent} from '@textory/editor-common';
import {useEditorState} from '@tiptap/react';
import cx from 'classnames';
import ToolbarContext from '../../context/toolbarContext.ts';
import {command, option} from '../../utils/index.ts';
import {ToolBarItemDivider} from '../ToolbarItem';

const HeaderButtonDropdown: FC<{ onClick?: () => void }> = props => {
  const { onClick } = props;
  const { editor } = useContext(ToolbarContext);
  const state = useEditorState({
    editor,
    selector: ({ editor }) => ({
      isParagraph:
        editor.isActive('paragraph') && !editor.isActive('blockquote'),
      isBlockquote: editor.isActive('blockquote'),
      activeHeadingLevels: headers
        .filter(h => h.type === BLOCK_TYPES.H)
        .map(h => ({
          level: h.attrs.level,
          active: editor.isActive('heading', { level: h.attrs.level }),
        })),
    }),
  });
  const isHeadingActive = (level: number) =>
    !!state?.activeHeadingLevels.find(h => h.level === level)?.active;
  const createHeaderItem = () => {
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
            {state?.isParagraph ? (
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
            {state?.isBlockquote ? (
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
            {isHeadingActive(attrs.level) ? (
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
  };
  return (
    <div className="textory-header-dropdown">{createHeaderItem()}</div>
  );
};
export default HeaderButtonDropdown;
