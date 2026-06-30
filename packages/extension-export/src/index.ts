import type { JSONContent } from '@tiptap/core';
import { message } from '@textory/editor-common-ui';
import { generateDOCX } from './generator';
import type { DocxOptions, ExportOptions } from './option';

export async function handleExportDOCX(
  name: string,
  json: JSONContent,
  watermark?: DocxOptions['watermark'],
): Promise<void> {
  try {
    if (!json) {
      message.warning('请先打开文档后再导出DOCX');

      return;
    }

    if (!json?.content?.length) {
      message.warning('文档内容为空');

      return;
    }

    const docx = await generateDOCX(
      {
        type: 'doc',
        content: json.content.map((item: any) => {
          // 兼容图片节点的不同属性命名（src / imageUrl）
          if (['textToImage', 'imageBlock'].includes(item.type)) {
            return {
              attrs: {
                ...item.attrs,
                src: item.attrs?.src ? item.attrs?.src : item.attrs?.imageUrl,
              },
              type: 'image',
            };
          }

          return item;
        }),
      },
      { outputType: 'arraybuffer', watermark, title: name },
    );

    // Convert Node.js Buffer to browser-compatible Blob
    const blob = new Blob([new Uint8Array(docx)], {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    });

    const sanitizedName = name.trim().replace(/\s+/g, '_');
    const fileName = `${sanitizedName}.docx`;

    // Download file
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();

    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  } catch (error: any) {
    message.error(`导出DOCX失败: ${error.message || '未知错误'}`);
  }
}

/**
 * 导出 Tiptap 文档内容为 DOCX (Word) 文件。
 *
 * @param options - 导出选项
 * @param options.data.title - 文档标题（必填）
 * @param options.data.content - Tiptap JSONContent 文档内容（必填）
 * @param options.watermark - 水印配置；不传或 false 表示不加水印
 * @param options.onExportStarted - 导出开始回调
 * @param options.onExportComplete - 导出成功回调
 * @param options.onExportFailed - 导出失败回调
 */
export const exportWORD = async (options: ExportOptions = {}) => {
  const {
    onExportComplete,
    onExportFailed,
    onExportStarted,
    data: dataInOptions,
    watermark,
  } = options;
  const title = dataInOptions?.title;
  const content = dataInOptions?.content;
  if (title && content) {
    try {
      onExportStarted?.();
      await handleExportDOCX(
        title as string,
        content as JSONContent,
        // 不传 watermark 或传 false → 不加水印
        watermark === false ? undefined : watermark,
      );
      onExportComplete?.();
    } catch (e) {
      onExportFailed?.();
    }
  } else {
    message.warning('缺少标题或正文内容，无法导出');
  }
};

export type { ExportOptions, DocxOptions } from './option';
export type { IExportWatermark } from './types';
