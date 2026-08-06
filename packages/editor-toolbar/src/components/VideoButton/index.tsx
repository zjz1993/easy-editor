import {DropdownList, Iconfont, IntlComponent, Upload} from '@textory/editor-common';
import {type FC, useContext, useState} from 'react';
import type {TToolbarWrapperProps} from '../../types/index.ts';
import UploadNetworkVideoModal from './UploadNetworkVideoModal.tsx';
import ToolbarContext from '../../context/toolbarContext.ts';
import cx from 'classnames';
import {v4 as uuid} from 'uuid';
import ToolbarItemButtonWrapper from '../ToolbarItemButtonWrapper';
import {
  removeUploadProgress,
  updateUploadProgress,
} from '@textory/extension-upload';
import {makeCustomRequest} from '../../utils/makeCustomRequest.ts';

/**
 * Toolbar entry for video. Mirrors `ImageButton`:
 * - Dropdown with two entries: insert network video (modal) + upload local.
 * - `uploaderKey="videoUploader"` binds to the ref that the paste/drop
 *   plugin dispatches dropped videos to.
 *
 * Inserted node carries `type: 'local'` or `type: 'embed'` so the
 * NodeView knows whether to render `<video>` or `<iframe>`. Embed URLs
 * are inserted as-is — no watch-to-embed conversion (user is expected
 * to paste the embed URL from the platform's share UI).
 *
 * If `features.videoUpload=false`, `videoProps` is undefined and we
 * early-return null (toolbar slot stays empty).
 */
const VideoButton: FC<TToolbarWrapperProps> = props => {
  const {disabled, intlStr, style, editor} = props;
  const {videoProps} = useContext(ToolbarContext);
  const [open, setOpen] = useState(false);

  if (!videoProps) return null;
  const {
    onVideoUpload,
    onVideoBeforeUpload,
    maxFileSize,
    accept,
    onVideoStartUpload,
    onVideoEndUpload,
  } = videoProps;

  return (
    <>
      <ToolbarItemButtonWrapper
        intlStr={intlStr}
        className={cx(
          'textory-toolbar__item__btn',
          'textory-toolbar__item__dropdown',
        )}
        style={style}
        disabled={disabled}
      >
        <DropdownList
          disabled={disabled}
          options={[
            {
              label: IntlComponent.get('video.network.insert'),
              value: '1',
              onClick: () => {
                setOpen(true);
              },
            },
            {
              label: (
                <Upload
                  editor={editor}
                  uploaderKey="videoUploader"
                  accept={accept ?? '.mp4,.webm,.mov,.m4v'}
                  acceptErrMsg="支持的视频格式：mp4、webm、mov、m4v"
                  multiple
                  beforeUpload={onVideoBeforeUpload}
                  onError={(_, _a, file) => {
                    const uploadKey = (file as any).__videoUploadKey;
                    if (!uploadKey) return;
                    editor.commands.updateVideoByUploadKey(uploadKey, {
                      src: undefined,
                      isError: true,
                    });
                    removeUploadProgress(editor, uploadKey);
                  }}
                  onProgress={(event, file) => {
                    const uploadKey = (file as any).__videoUploadKey;
                    if (!uploadKey) return;
                    updateUploadProgress(editor, uploadKey, event.percent);
                  }}
                  onStart={file => {
                    const uploadKey = uuid();
                    (file as any).__videoUploadKey = uploadKey;
                    onVideoStartUpload?.();
                    editor
                      .chain()
                      .focus()
                      .setVideo({
                        uploadKey,
                        src: URL.createObjectURL(file),
                        name: file.name,
                        size: file.size,
                      })
                      .run();
                    updateUploadProgress(editor, uploadKey, 0);
                  }}
                  onSuccess={(res, file) => {
                    const uploadKey = (file as any).__videoUploadKey;
                    if (!uploadKey) return;
                    editor.commands.updateVideoByUploadKey(uploadKey, {
                      src: res.data,
                    });
                    removeUploadProgress(editor, uploadKey);
                    onVideoEndUpload?.();
                  }}
                  maxFileSize={maxFileSize}
                  customRequest={makeCustomRequest(onVideoUpload)}
                >
                  {IntlComponent.get('video.local.upload')}
                </Upload>
              ),
              value: '2',
              onClick: () => {},
            },
          ]}
        >
          <Iconfont type="video" />
        </DropdownList>
      </ToolbarItemButtonWrapper>
      <UploadNetworkVideoModal
        onSubmit={data => {
          editor
            .chain()
            .focus()
            .setVideo({
              src: data.src,
              ...(data.poster ? {poster: data.poster} : {}),
            })
            .run();
        }}
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
};
export default VideoButton;
