import {filter, isEmpty, map, size, some, toArray} from 'lodash-es';
import {message} from '@textory/editor-common-ui';
import IntlComponent from 'react-intl-universal';
import {convertToTable} from './convertToTable.ts';
import type {RcFile} from "rc-upload/es/interface";

// doDownloadByUrl / isEsc 已迁移到 @textory/editor-common-ui，这里 re-export 维持向后兼容
export {doDownloadByUrl, isEsc} from '@textory/editor-common-ui';
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
export const isRichTextFormatMIME = (type: string) => {
  return /^text\/rtf$/i.test(type);
};
export const getFilesFromEvent = (
  e: {
    nativeEvent: any;
    clipboardData: any;
    dataTransfer: any;
  },
  view: any,
) => {
  if (!e) {
    return;
  }
  if (e?.nativeEvent) {
    e = e.nativeEvent;
  }

  /**
   * 粘贴复制方式获取数据源 clipboardData
   * 拖拽复制方式获取数据源 dataTransfer
   */
  const transfer = e.clipboardData || e.dataTransfer;
  const html = transfer.getData('text/html');
  if (!transfer) {
    return [];
  }
  const isRTFData = some(transfer.types, type => isRichTextFormatMIME(type));

  if (isRTFData) {
    return [];
  }
  // 处理粘贴excel的逻辑
  if (html && html.indexOf('excel') > -1) {
    const tableHtml = convertToTable(html, view.state.schema, view.dom.editor);
    return [tableHtml];
  }
  if (!isEmpty(transfer.files)) {
    return toArray(transfer.files);
  }
  if (!isEmpty(transfer.items)) {
    const fileItems = filter(transfer.items, item => {
      return item.kind === 'file';
    });
    return map(fileItems, item => item.getAsFile());
  }
  return [];
};
export function checkMaxSize(file: RcFile, maxSize: number) {
  if (!maxSize) {
    return Promise.resolve(file);
  }

  const checkFileSize =
    Number.parseFloat((file.size / 1024).toFixed(4)) <= maxSize;
  if (!checkFileSize) {
    return Promise.reject(new Error(`文件大小不能大于${maxSize}Kb`));
  }
  return Promise.resolve(file);
}
