import type {AlignType} from "@textory/context";
import {Dropdown, Iconfont, IntlComponent} from '@textory/editor-common';
import type {Editor} from '@tiptap/core';
import {type FC, useState} from 'react';
import {useEditorState} from '@tiptap/react';
import cx from 'classnames';

export interface HeadingDropdownProps {
  editor: Editor;
}
const alignArray: AlignType[] = ['left', 'center', 'right'];
const AlignDropdown: FC<HeadingDropdownProps> = ({editor}) => {
  const [open, setOpen] = useState(false);
  const { activeAlign } = useEditorState({
    editor,
    selector: ({ editor }) => ({
      activeAlign:
        alignArray.find(item => editor.isActive({ textAlign: item })) ??
        'left',
    }),
  });

  const handleSelect = (item: AlignType) => {
    editor.chain().focus().setTextAlign(item).run();
    setOpen(false);
  };

  return (
    <Dropdown
      visible={open}
      onVisibleChange={setOpen}
      popup={
        <div className="textory-text-bubble__heading-list">
          {alignArray.map(item => {
            const isActive = item === activeAlign;
            const label = IntlComponent.get(`align.${item}`)
            return (
              <div
                key={item}
                className={cx('textory-text-bubble__heading-item', {
                  'is-active': isActive,
                })}
                onClick={() => handleSelect(item)}
              >
                <Iconfont type={`icon-align-${item}`} />
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
          {IntlComponent.get(`align.${activeAlign}`)}
        </span>
      </button>
    </Dropdown>
  );
};

export default AlignDropdown;
