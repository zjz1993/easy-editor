import type { FC } from 'react';
import './styles/root.scss';
import { Iconfont, Tooltip } from '@easy-editor/editor-common';
import type { Editor } from '@tiptap/core';

interface IToolbarProps {
  editor: Editor | null;
}

const Toolbar: FC<IToolbarProps> = props => {
  const { editor } = props;
  return (
    <div className="easy-editor-toolbar">
      <div className="easy-editor-toolbar__item">
        <div className="easy-editor-toolbar__btn">123</div>
      </div>
      <div className="easy-editor-toolbar__item">
        <Tooltip text="aaa">
          <div
            onClick={() => {
              // editor?.chain().focus().toggleBold().run();
            }}
          >
            <Iconfont type="add" />
          </div>
        </Tooltip>
      </div>
    </div>
  );
};
export default Toolbar;
