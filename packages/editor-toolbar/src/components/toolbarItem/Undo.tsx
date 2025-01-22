import { Iconfont, Intl, Tooltip } from '@easy-editor/editor-common';
import { type CSSProperties, type FC, useContext } from 'react';
import ToolbarContext from '../../context/toolbarContext.ts';
import { command } from '../../utils/index.ts';
import { Button } from '../Button.tsx';
import ToolBarItem from '../ToolBarItem.tsx';

export type UndoProps = {
  className?: string;
  style?: CSSProperties;
  title?: string;
};

export const Undo: FC<UndoProps> = ({ className, style, title }) => {
  const { editor } = useContext(ToolbarContext);
  return (
    <ToolBarItem className={className} style={style}>
      <Tooltip text={Intl.get('toolbar.undo', { command })}>
        <Button
          onClick={() => {
            // @ts-ignore
            editor?.chain().focus().undo?.().run();
          }}
          disabled={!(editor.can().chain().focus() as any).undo?.().run()}
        >
          <Iconfont type="icon-undo" />
        </Button>
      </Tooltip>
    </ToolBarItem>
  );
};
