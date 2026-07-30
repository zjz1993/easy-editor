import {Iconfont, IntlComponent} from '@textory/editor-common';

type VideoErrorViewProps = {
  onRemove: () => void;
  /**
   * Locale key for the error message. Defaults to the upload-failure
   * message so existing callers (upload error path) keep their behavior.
   * Network-video playback failures should pass `video.playback.failed`.
   */
  messageKey?: string;
};

const VideoErrorView = ({onRemove, messageKey = 'video.upload.failed'}: VideoErrorViewProps) => {
  return (
    <div className="textory-video-upload-error">
      <div className="inner-wrapper">
        <Iconfont type="video" style={{marginRight: 5}} />
        <span>{IntlComponent.get(messageKey)}</span>
      </div>
      <Iconfont
        type="close"
        className="close-icon"
        onClick={onRemove}
      />
    </div>
  );
};
export default VideoErrorView;
