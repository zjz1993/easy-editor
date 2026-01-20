import {assign, isNil} from '@textory/editor-common';

const fileKey2Attachments = {}; // fileKey到attachment的映射
const upFileId2OriSize = {};
const fileKey2UpFileId = {};

export const addAttachments = attachments => {
  assign(fileKey2Attachments, attachments);
};

export const getAttachment = fileKey => {
  return fileKey2Attachments[`${fileKey}`];
};

export const hasAttachment = fileKey => {
  return !isNil(fileKey2Attachments[`${fileKey}`]);
};

export const setAttachmentOriSize = (fileId, oriSize) => {
  upFileId2OriSize[fileId] = oriSize;
};

export const getAttachmentOriSize = fileKey => {
  const fileId = fileKey2UpFileId[`${fileKey}`];
  return upFileId2OriSize[fileId];
};

export const setFileKey2UpFieldId = (fileKey, fileId) => {
  fileKey2UpFileId[`${fileKey}`] = fileId;
};

export const getUpFieldIdByFileKey = fileKey => {
  return fileKey2UpFileId[`${fileKey}`];
};
