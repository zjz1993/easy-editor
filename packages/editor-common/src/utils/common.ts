import {KeyCode} from '../const';
import {size} from 'lodash-es';
import {message} from '../components/Message';
import IntlComponent from 'react-intl-universal';

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

export async function smartClipboardCopy(html: string, text?: string) {
  // 自动生成纯文本：去除所有 HTML 标签并解码实体
  const plainText =
    text ??
    html
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '') // 去样式
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '') // 去脚本
      .replace(/<\/(td|th)>/gi, '\t') // 单元格换成制表符
      .replace(/<\/tr>/gi, '\n') // 行换成换行
      .replace(/<[^>]+>/g, '') // 去掉所有标签
      .replace(/&nbsp;/g, ' ') // 解码空格
      .trim();

  try {
    if (navigator.clipboard?.write) {
      // ✅ 现代浏览器支持 ClipboardItem API
      const blobItems: Record<string, Blob> = {
        'text/html': new Blob([html], { type: 'text/html' }),
        'text/plain': new Blob([plainText], { type: 'text/plain' }),
      };

      await navigator.clipboard.write([new ClipboardItem(blobItems)]);
      message.success(IntlComponent.get('common.copy.success'));
    } else {
      // ⚠️ 兼容旧浏览器
      const textarea = document.createElement('textarea');
      textarea.value = plainText;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      console.log('⚠️ 已回退为纯文本复制');
    }
  } catch (err) {
    message.success(IntlComponent.get('common.copy.fail'));
  }
}
