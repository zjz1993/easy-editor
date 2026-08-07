/**
 * postbuild: 把 standalone-demo 的 HTML 与 UMD bundle 拷进 editor-demo 的
 * 构建产物，让 prod 部署后 docs 里 iframe 仍可同源加载示例。
 *
 * 拷贝映射：
 *
 *   dev/standalone-demo/*.html              → editor/standalone-demo/*.html
 *   packages/standalone/dist/textory.*      → editor/packages/standalone/dist/textory.*
 *
 * HTML 内 `../../packages/standalone/dist/` 在 prod 改写为绝对路径 `${BASE_URL}packages/standalone/dist/`,
 * 避免因 iframe 加载路径与 SPA base 不一致导致相对路径解析少前缀（实测出现过
 * iframe URL 没带 `/editor/` 时,`../../packages/...` 解析丢失 `/editor` 前缀）。
 *
 * BASE_URL 默认 `/editor/`,与 vite.config build base 一致；可通过环境变量
 * `BASE_PATH` 覆盖。
 *
 * 缺失产物时打印警告但不抛错，允许只构建 SPA 不阻塞。
 */
import {cpSync, mkdirSync, existsSync, readdirSync, readFileSync, writeFileSync} from 'node:fs';
import {resolve, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const editorDemoRoot = resolve(__dirname, '..');
const repoRoot = resolve(editorDemoRoot, '../..');
const outDir = resolve(editorDemoRoot, 'editor');

// prod base,结尾必须带 /
const BASE_PATH = (process.env.BASE_PATH || '/editor/').replace(/\/?$/, '/');

const DEMO_FILES = [
  'index.html',
  'basic.html',
  'external-react.html',
  'upload.html',
  'features.html',
  'destroy.html',
];

// UMD bundle + 配套 css / sourcemap
const BUNDLE_FILES = (() => {
  const distDir = resolve(repoRoot, 'packages/standalone/dist');
  if (!existsSync(distDir)) return [];
  return readdirSync(distDir).filter((f) =>
    /^textory\.(standalone|externals|min)\.(min\.js|min\.css|js|css)(\.map)?$/.test(f) ||
    /^textory\.min\.css(\.map)?$/.test(f),
  );
})();

// 把 HTML 内 link/script 的 `../../packages/standalone/dist/` 改写为绝对路径
// `${BASE_PATH}packages/standalone/dist/`,跳过 <code> 文本展示
function rewriteHtml(content) {
  const absPrefix = `${BASE_PATH}packages/standalone/dist/`;
  return content.replace(
    /((?:src|href)=["'])(\.\.\/)+packages\/standalone\/dist\//g,
    (_m, prefix) => `${prefix}${absPrefix}`,
  );
}

function copyDemoFiles() {
  const src = resolve(repoRoot, 'dev/standalone-demo');
  const dst = resolve(outDir, 'standalone-demo');
  mkdirSync(dst, {recursive: true});
  let copied = 0;
  for (const f of DEMO_FILES) {
    const s = resolve(src, f);
    if (!existsSync(s)) {
      console.warn(`[copy-standalone-demo] skip missing ${f}`);
      continue;
    }
    const raw = readFileSync(s, 'utf-8');
    const rewritten = rewriteHtml(raw);
    writeFileSync(resolve(dst, f), rewritten);
    copied += 1;
  }
  console.log(`[copy-standalone-demo] standalone-demo: ${copied} file(s) → editor/standalone-demo/`);
}

function copyBundles() {
  const src = resolve(repoRoot, 'packages/standalone/dist');
  const dst = resolve(outDir, 'packages/standalone/dist');
  mkdirSync(dst, {recursive: true});
  if (BUNDLE_FILES.length === 0) {
    console.warn(
      '[copy-standalone-demo] WARN: packages/standalone/dist 没找到 UMD 产物。\n' +
        '  先跑 `pnpm --filter @textory/standalone build` 再 build:docs,否则 prod iframe 会 404。',
    );
    return;
  }
  for (const f of BUNDLE_FILES) {
    cpSync(resolve(src, f), resolve(dst, f));
  }
  console.log(
    `[copy-standalone-demo] UMD bundle: ${BUNDLE_FILES.length} file(s) → editor/packages/standalone/dist/`,
  );
}

copyDemoFiles();
copyBundles();
console.log('[copy-standalone-demo] done');
