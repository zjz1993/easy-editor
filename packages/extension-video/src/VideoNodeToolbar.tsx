import type {FC} from 'react';
import {InputNumber, useControlledValue} from '@textory/editor-common';
import ToolbarButton from './components/ToolbarButton';
import type {AlignType} from '@textory/context';

/**
 * Inline toolbar shown when the video node is selected (hover popover).
 *
 * Mirrors `ImageNodeToolbar` minus the `border` toggle — videos don't
 * have a border affordance. Provides:
 * - numeric width input (height auto-derives from ratio)
 * - left / center / right alignment
 * - set / clear poster (captures the current playback frame via canvas)
 * - remove node
 */
const VideoNodeToolbar: FC<{
  defaultWidth: number;
  onWidthChange: (width: number) => void;
  onAlignChange: (align: AlignType) => void;
  onRemove: () => void;
  onSetPoster: () => void;
  onClearPoster: () => void;
  align: AlignType;
  hasPoster: boolean;
  /**
   * True while the poster is being captured / uploaded. Swaps the set
   * button to a spinning loader and disables both poster buttons so the
   * user can't fire a second capture concurrently.
   */
  posterLoading?: boolean;
}> = props => {
  const {
    onAlignChange,
    align,
    onRemove,
    defaultWidth,
    onWidthChange,
    onSetPoster,
    onClearPoster,
    hasPoster,
    posterLoading,
  } = props;
  const [width, setWidth] = useControlledValue<number>({
    value: defaultWidth,
    defaultValue: 1,
  });

  return (
    <div className="textory-video-toolbar">
      <div className="textory-video-toolbar-item textory-video-toolbar-input-item">
        <span>宽：</span>
        <InputNumber
          suffix="px"
          min={1}
          value={width}
          onChange={value => {
            setWidth(value as number);
            onWidthChange(value as number);
          }}
        />
      </div>
      {(['left', 'center', 'right'] as AlignType[]).map(item => (
        <ToolbarButton
          key={item}
          isActive={align === item}
          icon={`align-${item}`}
          onClick={() => {
            onAlignChange(item);
          }}
          tooltip={`align.${item}`}
        />
      ))}
      <ToolbarButton
        icon={posterLoading ? 'loading' : 'image'}
        iconClassName={posterLoading ? 'icon-spin' : undefined}
        disabled={posterLoading}
        onClick={onSetPoster}
        tooltip="video.poster.set"
      />
      <ToolbarButton
        icon="close"
        disabled={!hasPoster || posterLoading}
        onClick={onClearPoster}
        tooltip="video.poster.clear"
      />
      <ToolbarButton
        iconClassName="icon icon-delete"
        icon="remove"
        onClick={onRemove}
        tooltip="delete"
      />
    </div>
  );
};
export default VideoNodeToolbar;
