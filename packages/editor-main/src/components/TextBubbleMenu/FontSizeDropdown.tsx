import {Dropdown, Iconfont} from '@textory/editor-common';
import type {Editor} from '@tiptap/core';
import {type FC, useState} from 'react';
import {useEditorState} from '@tiptap/react';
import cx from 'classnames';

const FONT_SIZE_PRESET: Array<{label: string; value: string}> = [
  {label: '12', value: '12'},
  {label: '14', value: '14'},
  {label: '16', value: '16'},
  {label: '18', value: '18'},
  {label: '24', value: '24'},
  {label: '32', value: '32'},
  {label: '48', value: '48'},
];

export interface FontSizeDropdownProps {
  editor: Editor;
}

/**
 * 字号预设下拉。
 *
 * 性能：仅订阅当前选区 fontSize mark 的 size 值；selector 返回字符串，
 * Tiptap deep-compare 在 size 未变时跳过渲染。
 */
const FontSizeDropdown: FC<FontSizeDropdownProps> = ({editor}) => {
  const [open, setOpen] = useState(false);
  const {activeSize} = useEditorState({
    editor,
    selector: ({editor}) => {
      const attrs = editor.getAttributes('fontSize');
      return {activeSize: (attrs?.size as string | undefined) ?? ''};
    },
  });
  return (
    <Dropdown
      visible={open}
      onVisibleChange={setOpen}
      showIcon={false}
      popup={
        <div className="textory-text-bubble__fontsize-list">
          <div
            className="textory-text-bubble__fontsize-item textory-text-bubble__fontsize-item--default"
            onClick={() => {
              editor.chain().focus().unsetFontSize().run();
              setOpen(false);
            }}
          >
            默认
          </div>
          {FONT_SIZE_PRESET.map(item => (
            <div
              key={item.value}
              className={cx('textory-text-bubble__fontsize-item', {
                'is-active': activeSize === item.value,
              })}
              onClick={() => {
                editor.chain().focus().setFontSize(item.value).run();
                setOpen(false);
              }}
            >
              {item.label}
            </div>
          ))}
        </div>
      }
    >
      <button
        type="button"
        className="textory-text-bubble__btn textory-text-bubble__btn--fontsize"
        title="字号"
      >
        <span className="textory-text-bubble__fontsize-label">
          {activeSize || '字号'}
        </span>
        <Iconfont type="icon-caret-down" />
      </button>
    </Dropdown>
  );
};

export default FontSizeDropdown;
