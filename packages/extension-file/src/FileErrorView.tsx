import {Iconfont} from '@textory/editor-common';
import type {FC} from 'react';

interface FileErrorViewProps {
  onRemove: () => void;
}

const FileErrorView: FC<FileErrorViewProps> = ({ onRemove }) => {
  return (
    <div className="textory-file-upload-error">
      <div className="inner-wrapper">
        <Iconfont type="icon-file" style={{ marginRight: 5 }} />
        <span>文件上传失败</span>
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
