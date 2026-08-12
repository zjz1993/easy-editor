import {Iconfont, IntlComponent} from '@textory/editor-common';
import type {FC} from 'react';

interface FileErrorViewProps {
  onRemove: () => void;
}

const FileErrorView: FC<FileErrorViewProps> = ({ onRemove }) => {
  return (
    <div className="textory-file-upload-error">
      <div className="inner-wrapper">
        <Iconfont type="icon-file" style={{ marginRight: 5 }} />
        <span>{IntlComponent.get('file.upload.failed')}</span>
      </div>
      <Iconfont
        type="icon-close"
        className="close-icon"
        onClick={onRemove}
      />
    </div>
  );
};

export default FileErrorView;
