import {BLOCK_TYPES} from '../const';
import {Node, NodeType} from '@tiptap/pm/model';
import {isString, size} from 'lodash-es';

const judgeNodeType = types => {
  return (node: { type: { name: any }; name: any }) => {
    if (node instanceof Node) {
      return types.includes(node.type.name);
    }
    if (node instanceof NodeType) {
      return types.includes(node.name);
    }
    if (isString(node)) {
      return types.includes(node);
    }
    return false;
  };
};
export const isImageNode = judgeNodeType([BLOCK_TYPES.IMG]);

export const isVideoNode = judgeNodeType([BLOCK_TYPES.VIDEO]);

export const isFileNode = judgeNodeType([BLOCK_TYPES.FILE]);

export const isImageExt = (ext: string) => {
  return /^(png|jpg|jpeg|gif)$/i.test(ext);
};

export const isVideoExt = (ext: string) => {
  return /^(mp4|m4v|webm|mov|quicktime|ogg|x-msvideo|mpeg|x-ms-wmv|x-flv|x-m4v)$/i.test(
    ext,
  );
};

/**
 * 判断是否是可预览的图片类型(大于20M图片不能预览)
 */
export const MAX_UPLOAD_IMAGE_SIZE = 50; //20971520;
export const isPreviewableImage = (file: { size: number }) => {
  return file.size / 1024 / 1024 <= MAX_UPLOAD_IMAGE_SIZE;
};
/**
 * 解析文件名称
 * @param fileName
 */
export const parseFileName = (fileName: string) => {
  if (!isString(fileName)) {
    return [];
  }
  const arr = fileName.split('.');
  if (size(arr) === 1) {
    return [fileName, ''];
  }
  const ext = arr.pop();
  const name = arr.join('.');
  return [name, ext];
};
