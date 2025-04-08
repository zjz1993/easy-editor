import {IntlComponent} from '@easy-editor/editor-common';

const UnSupportImagePreview = () => {
  return (
    <div className="kms-image-unsupported">
      <div className="kms-file-preview-icon image" />
      <div className="content">{IntlComponent.get('image.not.support')}</div>
    </div>
  );
};

export default UnSupportImagePreview;
