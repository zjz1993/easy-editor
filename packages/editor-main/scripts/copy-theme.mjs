// 将 @textory/styles 构建产物拷贝到 @textory/editor 的 dist/theme/normal.css
// 这样用户可以通过 `import '@textory/editor/theme/normal.css'` 直接引入样式
import {copyFileSync, mkdirSync, existsSync} from 'node:fs';
import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const src = resolve(__dirname, '../node_modules/@textory/styles/dist/index.css');
const dest = resolve(__dirname, '../dist/theme/normal.css');

if (!existsSync(src)) {
  throw new Error(
    `[copy-theme] 找不到源文件: ${src}\n` +
      '请先构建 @textory/styles 包（pnpm --filter @textory/styles build）',
  );
}

mkdirSync(dirname(dest), {recursive: true});
copyFileSync(src, dest);
console.log(`[copy-theme] ${src} → ${dest}`);
