import {forwardRef, useEffect, useImperativeHandle, useRef, useState} from 'react';
import type {SuggestionKeyDownProps, SuggestionProps} from '@tiptap/suggestion';
import {IntlComponent} from '@textory/editor-common';
import type {SlashItem} from './types';
import {resolveSlashItemTitle} from './types';

interface SlashMenuRef {
  onKeyDown: (props: SuggestionKeyDownProps) => boolean;
}

export type SlashMenuProps = SuggestionProps<SlashItem>;

const SlashMenu = forwardRef<SlashMenuRef, SlashMenuProps>((props, ref) => {
  const {items} = props;
  const [selectedIndex, setSelectedIndex] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);

  const selectItem = (index: number) => {
    const item = items[index];

    if (!item) {
      return;
    }

    props.command(item);
  };

  // items 每次查询都是新数组，引用变化即查询变化，选中项归零。
  // 按 React 官方模式在渲染期间调整 state，避免 useEffect 引发额外渲染
  const [lastItems, setLastItems] = useState(items);
  if (lastItems !== items) {
    setLastItems(items);
    setSelectedIndex(0);
  }

  // 键盘上下移动时保持选中项在可视区内
  useEffect(() => {
    listRef.current
      ?.querySelector('.is-active')
      ?.scrollIntoView({block: 'nearest'});
  }, [selectedIndex]);

  useImperativeHandle(ref, () => ({
    onKeyDown({event}) {
      if (!items.length) {
        return false;
      }

      if (event.key === 'ArrowDown') {
        setSelectedIndex((prev) =>
          prev + 1 >= items.length ? 0 : prev + 1,
        );

        return true;
      }

      if (event.key === 'ArrowUp') {
        setSelectedIndex((prev) =>
          prev - 1 < 0 ? items.length - 1 : prev - 1,
        );

        return true;
      }

      if (event.key === 'Enter') {
        selectItem(selectedIndex);

        return true;
      }

      return false;
    },
  }));

  if (items.length === 0) {
    return (
      <div className="textory-slash-menu">
        <div className="textory-slash-menu-empty">
          {IntlComponent.get('slashCommand.noResult')}
        </div>
      </div>
    );
  }

  return (
    <div className="textory-slash-menu" ref={listRef}>
      {
        items.map((item, index) => {
          const active = index === selectedIndex;

          return (
            <button
              key={item.id}
              type="button"
              className={`textory-slash-menu-item ${
                active ? 'is-active' : ''
              }`}
              onMouseEnter={() => {
                setSelectedIndex(index);
              }}
              onMouseDown={(event) => {
                event.preventDefault();
                selectItem(index);
              }}
            >
              <div className="textory-slash-menu-item-title">
                {resolveSlashItemTitle(item)}
              </div>
              {item.description && (
                <div className="textory-slash-menu-item-description">
                  {item.description}
                </div>
              )}
            </button>
          );
        })
      }
    </div>
  );
});

export {SlashMenu, type SlashMenuRef};
