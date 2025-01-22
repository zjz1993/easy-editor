import type { FC } from 'react';
import './styles/root.scss';
import type { Editor } from '@tiptap/core';
import type { IToolbarCommonProps } from 'src/types/index.ts';
import { ToolBarItemDivider } from './components/ToolBarItemDivider.tsx';
import { Redo } from './components/toolbarItem/Redo.tsx';
import { Undo } from './components/toolbarItem/Undo.tsx';
import ToolbarContext from './context/toolbarContext.ts';

export interface IToolbarProps {
  editor: Editor | null;
}

const Toolbar: FC<IToolbarProps> = props => {
  const { editor } = props;
  const editorView = editor.view;
  const commonProps: IToolbarCommonProps = {
    dispatch: editorView.dispatch,
    value: editorView.state,
    view: editorView,
    editor,
  };
  return (
    <ToolbarContext.Provider value={{ ...commonProps }}>
      <div className="easy-editor-toolbar">
        <Undo />
        <Redo />
        <ToolBarItemDivider />
      </div>
    </ToolbarContext.Provider>
  );
};
export default Toolbar;
