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

export const Redo: FC<UndoProps> = ({ className, style, title }) => {
  const { editor } = useContext(ToolbarContext);
  return (
    <ToolBarItem className={className} style={style}>
      <Tooltip text={Intl.get('toolbar.redo', { command })}>
        <Button
          onClick={() => {
            // @ts-ignore
            editor?.chain().focus().redo?.().run();
          }}
          disabled={!(editor.can().chain().focus() as any).redo?.().run()}
        >
          <Iconfont type="icon-redo" />
        </Button>
      </Tooltip>
    </ToolBarItem>
  );
};
