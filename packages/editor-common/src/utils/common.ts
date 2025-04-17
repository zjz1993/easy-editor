import {KeyCode} from '../const';
import {size} from 'lodash-es';

export const doDownloadByUrl = (tempUrl: string) => {
  const linkNode = document.createElement('a');
  linkNode.style.display = 'none';
  linkNode.href = tempUrl;
  document.body.appendChild(linkNode);
  linkNode.click(); //模拟在按钮上的一次鼠标单击
  document.body.removeChild(linkNode);
};
export const isEsc = ({ keyCode }: { keyCode: any }) => {
  return keyCode === KeyCode.ESC;
};
export const isWindows = () => {
  return navigator.userAgent.indexOf('Windows') > -1;
};
export const parseMIMEType = (fileType: string) => {
  if (typeof fileType === 'string') {
    const arr = fileType.split('/');
    if (size(arr) !== 2) {
      return ['', ''];
    }
    return arr;
  }
  return '';
};
