import {
  Iconfont,
  IntlComponent,
} from '@easy-editor/editor-common/src/index.ts';
import type { FC } from 'react';
import { useContext } from 'react';
import './index.scss';
import ToolbarContext from '../../context/toolbarContext.ts';

const AlignPopup: FC<{ alignArray: string[] }> = props => {
  const { alignArray } = props;
  const { editor } = useContext(ToolbarContext);
  const mapItem = alignArray.map(item => {
    return (
      <div
        className="easy-editor-align-popup__item"
        key={item}
        onClick={() => editor.chain().focus().setTextAlign(item).run()}
      >
        <Iconfont
          type="icon-align-left"
          className="easy-editor-align-popup__item__icon"
        />
        {IntlComponent.get(`align.${item}`)}
      </div>
    );
  });
  return <div className="easy-editor-align-popup">{mapItem}</div>;
};
export default AlignPopup;
