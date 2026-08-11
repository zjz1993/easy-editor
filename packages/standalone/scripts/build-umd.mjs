/**
 * esbuild 构建脚本：产出 ESM + 两份 IIFE bundle。
 *
 * 产物：
 * 1. `dist/index.mjs` —— ESM 入口（给 npm ESM 用户），外置 React/Tiptap/@textory/*
 * 2. `dist/textory.standalone.min.js` —— IIFE all-in-one（React/ReactDOM 全打进去）
 * 3. `dist/textory.externals.min.js` —— IIFE 外置 React/ReactDOM
 *    - 用户必须先引 react UMD CDN（提供 window.React）
 *    - 用户必须先引 react-dom UMD CDN（提供 window.ReactDOM，含 createRoot）
 *
 * externals 版 React 外置实现：通过 esbuild plugin 拦截 `react` / `react-dom`
 * / `react-dom/client` / `react/jsx-runtime` 四种 specifier，
 * 替换为从 window 读取的 stub 模块（ESM 静态 export）。
 *
 * 详见 .ai/standalone-umd.md「构建约束」。
 */
import {build} from 'esbuild';
import {resolve, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {mkdir} from 'node:fs/promises';

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkgRoot = resolve(__dirname, '..');
const entry = resolve(pkgRoot, 'src/index.ts');
const outDir = resolve(pkgRoot, 'dist');

const loaders = {
  '.png': 'dataurl',
  '.jpg': 'dataurl',
  '.jpeg': 'dataurl',
  '.svg': 'dataurl',
};

const commonOptions = {
  bundle: true,
  entryPoints: [entry],
  logLevel: 'info',
  target: 'es2018',
  platform: 'browser',
  jsx: 'automatic',
  loader: loaders,
  treeShaking: true,
  legalComments: 'none',
};

// ────────────── React 全局映射 plugin（仅 IIFE externals 版用） ──────────────
// esbuild 不内置 globalExternals 选项，用 onResolve/onLoad 拦截 react 系列 specifier
// 替换为从 window 读取的 ESM stub。

// React 18 顶层 export 列表（含 hooks）
const REACT_EXPORTS = [
  'Children', 'Component', 'Fragment', 'Profiler', 'PureComponent', 'StrictMode',
  'Suspense', '__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED', 'cloneElement',
  'createContext', 'createElement', 'createFactory', 'createRef', 'forwardRef',
  'isValidElement', 'lazy', 'memo', 'startTransition', 'unstable_act',
  'useCallback', 'useContext', 'useDebugValue', 'useDeferredValue', 'useEffect',
  'useId', 'useImperativeHandle', 'useInsertionEffect', 'useLayoutEffect',
  'useMemo', 'useReducer', 'useRef', 'useState', 'useSyncExternalStore',
  'useTransition', 'version',
];

// ReactDOM 18 export（UMD CDN 提供）
const REACT_DOM_EXPORTS = [
  'createPortal', 'findDOMNode', 'flushSync', 'hydrate', 'render',
  'unmountComponentAtNode', 'unstable_batchedUpdates', 'unstable_renderSubtreeIntoContainer',
  'version',
];

// react-dom/client —— ReactDOM 18 UMD CDN 把 createRoot / hydrateRoot 挂在 window.ReactDOM 上
const REACT_DOM_CLIENT_EXPORTS = ['createRoot', 'hydrateRoot'];

function makeReactGlobalPlugin() {
  return {
    name: 'react-globals',
    setup(build) {
      // react
      build.onResolve({filter: /^react$/}, (args) => ({
        path: 'react',
        namespace: 'react-global',
      }));
      build.onLoad({filter: /^react$/, namespace: 'react-global'}, () => {
        const lines = [
          'const R = window.React;',
          'export default R;',
          ...REACT_EXPORTS.map((name) => `export const ${name} = R.${name};`),
        ];
        return {contents: lines.join('\n'), loader: 'js'};
      });

      // react/jsx-runtime / react/jsx-dev-runtime —— 用 React.createElement 实现
      build.onResolve({filter: /^react\/jsx-(dev-)?runtime$/}, (args) => ({
        path: args.path,
        namespace: 'react-global',
      }));
      build.onLoad(
        {filter: /^react\/jsx-(dev-)?runtime$/, namespace: 'react-global'},
        () => {
          const contents = `
const R = window.React;
export const Fragment = R.Fragment;
export const jsx = (type, props, key) => R.createElement(type, props ?? {}, key);
export const jsxs = (type, props, key) => R.createElement(type, props ?? {}, key);
`;
          return {contents, loader: 'js'};
        },
      );

      // react-dom
      build.onResolve({filter: /^react-dom$/}, (args) => ({
        path: 'react-dom',
        namespace: 'react-global',
      }));
      build.onLoad({filter: /^react-dom$/, namespace: 'react-global'}, () => {
        const lines = [
          'const D = window.ReactDOM;',
          'export default D;',
          ...REACT_DOM_EXPORTS.map((name) => `export const ${name} = D.${name};`),
        ];
        return {contents: lines.join('\n'), loader: 'js'};
      });

      // react-dom/client
      build.onResolve({filter: /^react-dom\/client$/}, (args) => ({
        path: 'react-dom/client',
        namespace: 'react-global',
      }));
      build.onLoad(
        {filter: /^react-dom\/client$/, namespace: 'react-global'},
        () => {
          const lines = [
            'const D = window.ReactDOM;',
            ...REACT_DOM_CLIENT_EXPORTS.map(
              (name) => `export const ${name} = D.${name};`,
            ),
          ];
          return {contents: lines.join('\n'), loader: 'js'};
        },
      );
    },
  };
}

// ESM 用户与 IIFE externals 用户共用：完全外置列表
const allExternals = [
  '@tiptap/*',
  '@textory/*',
  'lowlight',
  'lowlight/*',
  'classnames',
  'framer-motion',
  'ahooks',
  'rc-*',
  'lodash-es',
  'react-intl-universal',
  '@floating-ui/react',
  'react-hook-form',
  'uuid',
  'linkifyjs',
  'linkifyjs/*',
  'docx',
  'jszip',
  'image-meta',
  'use-sync-external-store',
  'use-sync-external-store/shim',
  'use-sync-external-store/shim/index.js',
];

async function ensureDir(p) {
  await mkdir(p, {recursive: true});
}

async function run() {
  await ensureDir(outDir);

  // 1. ESM bundle
  await build({
    ...commonOptions,
    format: 'esm',
    outfile: resolve(outDir, 'index.mjs'),
    external: ['react', 'react-dom', 'react/jsx-runtime', 'react/jsx-dev-runtime', ...allExternals],
    sourcemap: true,
  });

  // 2. IIFE standalone —— 全部内联
  // footer: esbuild IIFE 默认 `var Textory = (() => {...})()` 暴露 ESM namespace
  // (`{default: API, Textory: API}`) 而非 API 对象本身。
  // 在 IIFE 末尾覆盖 window.Textory 为 namespace.default(即 API 对象)。
  const iifeFooter =
    'if(typeof window!=="undefined"){window.Textory=(Textory&&Textory.default)||Textory;}';

  await build({
    ...commonOptions,
    format: 'iife',
    globalName: 'Textory',
    outfile: resolve(outDir, 'textory.standalone.min.js'),
    minify: true,
    sourcemap: true,
    external: [],
    footer: {js: iifeFooter},
  });

  // 3. IIFE externals —— 仅外置 React/ReactDOM（通过 plugin 拦截到 window）
  //    Tiptap / @textory/* / framer-motion / lowlight 等全部内联
  //    React/ReactDOM 系列 specifier 由 makeReactGlobalPlugin() 重定向到 window
  await build({
    ...commonOptions,
    format: 'iife',
    globalName: 'Textory',
    outfile: resolve(outDir, 'textory.externals.min.js'),
    minify: true,
    sourcemap: true,
    external: [],
    plugins: [makeReactGlobalPlugin()],
    footer: {js: iifeFooter},
  });

  // 4. IIFE highlight —— 仅语法高亮 bundle，无 React/Tiptap 依赖
  //    场景：渲染侧（论坛 post 详情页等）对编辑器产出的 <pre><code> 重新应用
  //    lowlight 高亮。bundle 体积 << standalone（仅含 lowlight + 9 语言）
  //    全部内联（lowlight 本身依赖 highlight.js common languages）
  await build({
    bundle: true,
    entryPoints: [resolve(pkgRoot, 'src/highlight.ts')],
    outfile: resolve(outDir, 'highlight.min.js'),
    format: 'iife',
    globalName: 'TextoryHighlight',
    target: 'es2018',
    platform: 'browser',
    minify: true,
    sourcemap: true,
    external: [],
    treeShaking: true,
    legalComments: 'none',
    loader: loaders,
    // globalName IIFE footer: 把 namespace.default 暴露到 window
    footer: {
      js: 'if(typeof window!=="undefined"){window.TextoryHighlight=(TextoryHighlight&&TextoryHighlight.default)||TextoryHighlight;}',
    },
  });

  // 5. IIFE outline —— 仅标题导航 bundle，无 React/Tiptap 依赖
  //    场景：渲染侧重新挂上右侧 TOC 面板。复用 outline.scss 的 class 名
  //    （已包含在 textory.min.css 中），无需额外 CSS
  await build({
    bundle: true,
    entryPoints: [resolve(pkgRoot, 'src/outline.ts')],
    outfile: resolve(outDir, 'outline.min.js'),
    format: 'iife',
    globalName: 'TextoryOutline',
    target: 'es2018',
    platform: 'browser',
    minify: true,
    sourcemap: true,
    external: [],
    treeShaking: true,
    legalComments: 'none',
    loader: loaders,
    footer: {
      js: 'if(typeof window!=="undefined"){window.TextoryOutline=(TextoryOutline&&TextoryOutline.default)||TextoryOutline;}',
    },
  });

  // 6. IIFE render —— facade bundle，内联 highlight + outline
  //    场景：渲染侧一键安装。给 div id 自动出 .textory wrap + 高亮 + outline
  //    体积 ~170KB（含 lowlight + 37 languages），单 script 单 API
  await build({
    bundle: true,
    entryPoints: [resolve(pkgRoot, 'src/render.ts')],
    outfile: resolve(outDir, 'render.min.js'),
    format: 'iife',
    globalName: 'TextoryRender',
    target: 'es2018',
    platform: 'browser',
    minify: true,
    sourcemap: true,
    external: [],
    treeShaking: true,
    legalComments: 'none',
    loader: loaders,
    footer: {
      js: 'if(typeof window!=="undefined"){window.TextoryRender=(TextoryRender&&TextoryRender.default)||TextoryRender;}',
    },
  });

  console.log('[build-umd] done');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
