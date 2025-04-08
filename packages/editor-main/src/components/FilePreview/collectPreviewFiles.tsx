import {getAttachment} from '../AttachmentManager/index.ts';
import UnSupportImagePreview from './UnSupportImagePreview.tsx';
import {getViewFileNodes} from './utils.ts';
import {assign, forEach, isImageExt, isPreviewableImage, parseFileName,} from '@easy-editor/editor-common';

const collectPreviewFiles = $view => {
  const files = [];
  const $files = getViewFileNodes($view);
  forEach($files, ($file, index) => {
    const fileKey = $file.dataset.filekey;
    const file = getAttachment(fileKey);
    if (file) {
      const preview = {
        id: file.id,
        fileKey: file.id,
        name: file.name,
        type: file.mime,
        previewUrl: file.previewUrl || file.url || file.src,
        url: file.url || file.src,
        downloadUrl: file.downloadUrl || file.url || file.src,
        originUrl: file.originUrl || file.url || file.src,
        index,
      };
      if (
        isImageExt(parseFileName(file.name)[1]) &&
        !isPreviewableImage(file)
      ) {
        assign(preview, {
          fileRender: () => <UnSupportImagePreview />,
        });
      }
      files.push(preview);
    }
  });
  return files;
};
export default collectPreviewFiles;
