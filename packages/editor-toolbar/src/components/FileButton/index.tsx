import {Iconfont, Upload} from '@textory/editor-common';
import {type FC, useContext} from 'react';
import type {TToolbarWrapperProps} from 'src/types/index.ts';
import ToolbarContext from '../../context/toolbarContext.ts';
import {v4 as uuid} from 'uuid';
import ToolbarItemButtonWrapper from '../ToolbarItemButtonWrapper';
import {
  removeUploadProgress,
  updateUploadProgress,
} from '@textory/extension-upload';
import {makeCustomRequest} from '../../utils/makeCustomRequest.ts';

/**
 * Toolbar entry for file-attachment upload.
 *
 * Parallel to `ImageButton`, but simplified:
 * - Single button (no dropdown) — there's no "network file" equivalent
 *   of `UploadNetworkImageModal`.
 * - `uploaderKey="fileUploader"` binds to the ref that the paste/drop
 *   plugin dispatches non-image files to.
 *
 * The actual file-node insertion lives in `setFile`, supplied by
 * `@textory/extension-file`. If `features.fileUpload=false`, the
 * extension isn't registered and this button isn't rendered either
 * (root.tsx passes `fileProps=undefined` to the toolbar, and we early
 * return below).
 */
const FileButton: FC<TToolbarWrapperProps> = props => {
  const { disabled, intlStr, style, editor } = props;
  const { fileProps } = useContext(ToolbarContext);

  if (!fileProps) return null;
  const {
    onFileUpload,
    onFileBeforeUpload,
    maxFileSize,
    accept,
    onFileStartUpload,
    onFileEndUpload,
  } = fileProps;

  return (
    <ToolbarItemButtonWrapper
      intlStr={intlStr}
      className="textory-toolbar__item__btn"
      style={style}
      disabled={disabled}
    >
      <Upload
        editor={editor}
        uploaderKey="fileUploader"
        accept={accept ?? '*'}
        acceptErrMsg="不支持的文件格式"
        multiple
        beforeUpload={onFileBeforeUpload}
        onError={(_, _a, file) => {
          const uploadKey = (file as any).__fileUploadKey;
          if (!uploadKey) return;
          editor.commands.updateFileByUploadKey(uploadKey, { isError: true });
          removeUploadProgress(editor, uploadKey);
        }}
        onProgress={(event, file) => {
          const uploadKey = (file as any).__fileUploadKey;
          if (!uploadKey) return;
          updateUploadProgress(editor, uploadKey, event.percent);
        }}
        onStart={file => {
          const uploadKey = uuid();
          (file as any).__fileUploadKey = uploadKey;
          onFileStartUpload?.();
          const name = file.name;
          const size = file.size;
          const ext = name.split('.').pop()?.toLowerCase() ?? '';
          editor
            .chain()
            .focus()
            .setFile({
              uploadKey,
              name,
              size,
              ext,
              src: '',
            })
            .run();
          updateUploadProgress(editor, uploadKey, 0);
        }}
        onSuccess={(res, file) => {
          const uploadKey = (file as any).__fileUploadKey;
          if (!uploadKey) return;
          editor.commands.updateFileByUploadKey(uploadKey, {
            src: res.data,
          });
          removeUploadProgress(editor, uploadKey);
          onFileEndUpload?.();
        }}
        maxFileSize={maxFileSize}
        customRequest={makeCustomRequest(onFileUpload)}
      >
        <Iconfont type="file" />
      </Upload>
    </ToolbarItemButtonWrapper>
  );
};
export default FileButton;
