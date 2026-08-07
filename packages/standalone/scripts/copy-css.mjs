/**
 * 把 @textory/editor 的 theme/normal.css 拷贝到 @textory/standalone/dist/textory.min.css。
 *
 * UMD 用户用法：
 * ```html
 * <link rel="stylesheet" href="textory.min.css">
 * ```
 *
 * 详见 .ai/standalone-umd.md「CSS 单独引」。
 *
 * 后续若 @textory/editor 增加主题（dark / compact），在此处追加拷贝逻辑即可。
 */
import {copyFileSync, mkdirSync, existsSync} from 'node:fs';
import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const src = resolve(
  __dirname,
  '../node_modules/@textory/editor/dist/theme/normal.css',
);
const dest = resolve(__dirname, '../dist/textory.min.css');

if (!existsSync(src)) {
  throw new Error(
    `[copy-css] 找不到源文件: ${src}\n` +
      '请先构建 @textory/editor 包（pnpm --filter @textory/editor build）',
  );
}

mkdirSync(dirname(dest), {recursive: true});
copyFileSync(src, dest);
console.log(`[copy-css] ${src} → ${dest}`);
