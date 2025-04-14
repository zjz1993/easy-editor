import {findIndex, forEach, isFileNode, isImageNode, PREVIEW_CLS,} from '@easy-editor/editor-common';

export const getViewFileNodes = $view => {
  return $view.querySelectorAll(`.${PREVIEW_CLS.FILE}`);
};
const getViewImageNodes = ($view: {
  querySelectorAll: (arg0: string) => any;
}) => {
  return $view.querySelectorAll(`.${PREVIEW_CLS.IMAGE}:not(.is-hidden)`);
};
export const collectImagePreviewFiles = $view => {
  const files = [];
  const $files = getViewImageNodes($view);
  forEach($files, ($file, index) => {
    const fileKey = $file.dataset.id;
    const previewUrl = $file.dataset.previewurl;
    const src = $file.querySelector('img').getAttribute('src');
    const preview = {
      id: fileKey,
      fileKey,
      name: '图片',
      type: 'image/png',
      previewUrl: previewUrl || src,
      url: src,
      downloadUrl: src,
      index,
    };
    files.push(preview);
  });
  return files;
};

export const getFileIndex = ($view, $fileEl) => {
  const $files = getViewFileNodes($view);
  return findIndex($files, $file => $file === $fileEl);
};

/**
 * 用于判断文档中是否存在已经上传的fileKey的Image节点或者File节点
 */
export const hasFileKeyInDoc = (doc, fileKey) => {
  if (!fileKey) {
    return false;
  }
  let hasUploadNode = false;
  doc.descendants(node => {
    if (isImageNode(node) || isFileNode(node)) {
      const { fileKey: curFileKey } = node.attrs;
      if (String(curFileKey) === String(fileKey)) {
        hasUploadNode = true;
      }
    }
    return !hasUploadNode;
  });
  return hasUploadNode;
};
