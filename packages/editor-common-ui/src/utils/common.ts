import { KeyCode } from './keycode';

/**
 * 通过临时 <a> 标签触发下载。
 */
export const doDownloadByUrl = (tempUrl: string) => {
  const linkNode = document.createElement('a');
  linkNode.style.display = 'none';
  linkNode.href = tempUrl;
  document.body.appendChild(linkNode);
  linkNode.click(); // 模拟在按钮上的一次鼠标单击
  document.body.removeChild(linkNode);
};

/**
 * 判断是否是 ESC 键。
 */
export const isEsc = ({ keyCode }: { keyCode: any }) => {
  return keyCode === KeyCode.ESC;
};
