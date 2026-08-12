import {Iconfont, IntlComponent} from '@textory/editor-common';

const ImageErrorView = ({ onRemove }: { onRemove: () => void }) => {
  return (
    <div className="textory-image-upload-error">
      <div className="inner-wrapper">
        <Iconfont type="image" style={{ marginRight: 5 }} />
        <span>{IntlComponent.get('image.upload.failed')}</span>
      </div>
      <Iconfont type="close" className="close-icon" onClick={onRemove} />
    </div>
  );
};
export default ImageErrorView;
