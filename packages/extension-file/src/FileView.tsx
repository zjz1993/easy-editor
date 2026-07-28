import {NodeViewWrapper, useEditorState} from '@tiptap/react';
import type {NodeViewProps} from '@tiptap/core';
import cx from 'classnames';
import {Iconfont} from '@textory/editor-common';
import {uploadPluginKey} from '@textory/extension-upload';
import {type FC, useMemo} from 'react';
import {isEmpty} from 'lodash-es';
import FileErrorView from './FileErrorView.tsx';
import {formatBytes, getIcon} from './utils/index.ts';

/**
 * Build the two-half ring rotation values used by the CSS progress ring.
 *
 * Same algorithm as `ImageView`'s `getProgressCircleProps` so the two
 * node types share visual language. If a third caller appears, lift this
 * into `@textory/extension-upload` or `@textory/editor-common`.
 */
const getProgressCircleProps = (value: number) => {
  const onePercentDeg = 360 / 100;
  const rightRotateDeg = value <= 50 ? onePercentDeg * value : 180;
  const leftRotateDeg = value > 50 ? onePercentDeg * (value - 50) : 0;
  const beginDeg = -45;
  const rightAnimationCls = value > 50 ? '' : 'has-animation';
  return {
    leftRotateDeg: beginDeg + leftRotateDeg,
    rightRotateDeg: beginDeg + rightRotateDeg,
    rightAnimationCls,
  };
};

const ProgressRing: FC<{ percent: number }> = ({ percent }) => {
  const { leftRotateDeg, rightRotateDeg, rightAnimationCls } =
    getProgressCircleProps(percent);
  return (
    <div className="textory-file-card__circle">
      <div className="circle-left">
        <div
          className="inner"
          style={{ transform: `rotate(${leftRotateDeg}deg)` }}
        />
      </div>
      <div className="circle-right">
        <div
          className={cx('inner', rightAnimationCls)}
          style={{ transform: `rotate(${rightRotateDeg}deg)` }}
        />
      </div>
      <div className="circle-text">
        {Number.parseInt(String(percent), 10)}%
      </div>
    </div>
  );
};

const FileView: FC<NodeViewProps> = props => {
  const { node, editor, view, getPos, selected } = props;
  const { attrs } = node;
  const { src, name, size, ext, uploadKey, id, isError } = attrs;

  const percent = useEditorState({
    editor,
    selector: ({ editor }) => {
      const pluginState = uploadPluginKey.getState(editor.state);
      const map = pluginState?.progressMap;
      if (!map || isEmpty(map)) return undefined;
      return uploadKey ? (map[uploadKey] ?? 0) : (map[id] ?? 0);
    },
  });

  const iconName = useMemo(() => getIcon(ext), [ext]);
  const formattedSize = useMemo(() => formatBytes(size), [size]);

  const handleRemove = () => {
    const pos = getPos();
    if (typeof pos !== 'number') return;
    const tr = view.state.tr.delete(pos, pos + 1);
    view.dispatch(tr);
    view.focus();
  };

  const handleClickCard = () => {
    const pos = getPos();
    if (typeof pos !== 'number') return;
    editor.chain().setNodeSelection(pos).run();
  };

  if (isError) {
    return (
      <NodeViewWrapper
        className={cx('textory-file-container', 'textory-block-container')}
        as="div"
      >
        <FileErrorView onRemove={handleRemove} />
      </NodeViewWrapper>
    );
  }

  return (
    <NodeViewWrapper
      className={cx('textory-file-container', 'textory-block-container')}
      as="div"
    >
      <div
        className={cx(
          'textory-file-card',
          selected && editor.isEditable && 'textory-file-card--selected',
        )}
        onClick={handleClickCard}
      >
        <Iconfont
          type={iconName}
          className="textory-file-card__icon"
        />
        <div className="textory-file-card__info">
          <div className="textory-file-card__name">{name}</div>
          {formattedSize && (
            <div className="textory-file-card__size">{formattedSize}</div>
          )}
        </div>
        {percent !== undefined && <ProgressRing percent={percent} />}
        {editor.isEditable && (
          <Iconfont
            type="icon-close"
            className="textory-file-card__remove"
            onClick={e => {
              e.stopPropagation();
              handleRemove();
            }}
          />
        )}
        {src && !editor.isEditable && (
          <a
            href={src}
            download={name ?? undefined}
            className="textory-file-card__download"
            target="_blank"
            rel="noreferrer"
            onClick={e => e.stopPropagation()}
          >
            <Iconfont type="icon-download" />
          </a>
        )}
      </div>
    </NodeViewWrapper>
  );
};

export default FileView;
