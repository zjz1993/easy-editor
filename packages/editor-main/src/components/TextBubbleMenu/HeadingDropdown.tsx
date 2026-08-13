import {Dropdown, Iconfont, IntlComponent} from '@textory/editor-common';
import {BLOCK_TYPES} from '@textory/editor-utils';
import type {Editor} from '@tiptap/core';
import {type FC, useState} from 'react';
import {useEditorState} from '@tiptap/react';
import cx from 'classnames';

export interface HeadingDropdownProps {
  editor: Editor;
}

interface HeadingItem {
  key: string;
  label: string;
  level: number; // 0 = paragraph, -1 = blockquote, 1-6 = heading
}

const HEADING_ITEMS: HeadingItem[] = [
  {key: 'paragraph', label: 'paragraph', level: 0},
  {key: 'quote', label: 'quote', level: -1},
  {key: 'h1', label: 'header.level', level: 1},
  {key: 'h2', label: 'header.level', level: 2},
  {key: 'h3', label: 'header.level', level: 3},
  {key: 'h4', label: 'header.level', level: 4},
  {key: 'h5', label: 'header.level', level: 5},
  {key: 'h6', label: 'header.level', level: 6},
];

/**
 * 标题级别下拉。
 *
 * 性能：仅订阅当前块级类型；selector 返回字符串，Tiptap deep-compare 在
 * 未变时跳过渲染。
 */
const HeadingDropdown: FC<HeadingDropdownProps> = ({editor}) => {
  const [open, setOpen] = useState(false);
  const {activeLevel, activeLabel} = useEditorState({
    editor,
    selector: ({editor}) => {
      if (editor.isActive(BLOCK_TYPES.QUOTE)) {
        return {activeLevel: -1, activeLabel: IntlComponent.get('quote')};
      }
      if (
        editor.isActive(BLOCK_TYPES.P) &&
        !editor.isActive(BLOCK_TYPES.QUOTE)
      ) {
        return {activeLevel: 0, activeLabel: IntlComponent.get('paragraph')};
      }
      for (let lvl = 1; lvl <= 6; lvl++) {
        if (editor.isActive(BLOCK_TYPES.H, {level: lvl})) {
          return {
            activeLevel: lvl,
            activeLabel: IntlComponent.get('header.level', {level: lvl}),
          };
        }
      }
      return {activeLevel: 0, activeLabel: IntlComponent.get('paragraph')};
    },
  });

  const handleSelect = (item: HeadingItem) => {
    if (item.level === 0) {
      editor.chain().focus().setParagraph().run();
    } else if (item.level === -1) {
      editor.chain().focus().toggleBlockquote().run();
    } else {
      editor.chain().focus().toggleHeading({level: item.level}).run();
    }
    setOpen(false);
  };

  return (
    <Dropdown
      visible={open}
      onVisibleChange={setOpen}
      popup={
        <div className="textory-text-bubble__heading-list">
          {HEADING_ITEMS.map(item => {
            const isActive = item.level === activeLevel;
            const label =
              item.level <= 0
                ? IntlComponent.get(item.label)
                : IntlComponent.get(item.label, {level: item.level});
            return (
              <div
                key={item.key}
                className={cx('textory-text-bubble__heading-item', {
                  'is-active': isActive,
                  [`textory-text-bubble__heading-item--h${item.level}`]:
                    item.level >= 1,
                })}
                onClick={() => handleSelect(item)}
              >
                {isActive && <Iconfont type="icon-gou-cu" />}
                <span className="textory-text-bubble__heading-label">
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      }
    >
      <button
        type="button"
        className="textory-text-bubble__btn textory-text-bubble__btn--heading"
        title={IntlComponent.get('header')}
      >
        <span className="textory-text-bubble__heading-current">
          {activeLabel}
        </span>
      </button>
    </Dropdown>
  );
};

export default HeadingDropdown;
