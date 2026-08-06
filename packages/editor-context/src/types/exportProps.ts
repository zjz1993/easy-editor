export interface IExportWatermark {
  /** 水印文本（与 image 二选一） */
  text?: string;
  /** 水印图片 URL 或 base64（与 text 二选一） */
  image?: string;
  /** 字号（pt），默认 52 */
  fontSize?: number;
  /** 颜色（HEX 不带 #），默认 848a99 */
  color?: string;
  /** 字体，默认 Microsoft YaHei */
  fontFamily?: string;
  /** 旋转角度，默认 315 */
  rotation?: number;
  /** 不透明度 0-1，默认 0.3 */
  opacity?: number;
}
export type ExportProps = {
  onExportStarted: () => void,
  onExportComplete: () => void,
  onExportFailed: () => void,
  watermark: IExportWatermark | false;
  /**
   * URL prefix for proxying cross-origin image / poster resources at export
   * time. Cross-origin resources are rewritten to:
   *   `${imageProxy}${encodeURIComponent(originalUrl)}`
   * and routed through the proxy (which fetches server-side, bypassing the
   * browser CORS policy). Applies to images, video posters, and the
   * watermark image. Base64 data URLs are not proxied.
   *
   * Example: `'https://your-host/upload/proxy?url='`
   */
  imageProxy?: string;
};
