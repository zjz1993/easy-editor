import path from 'path';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import image from '@rollup/plugin-image';
import json from '@rollup/plugin-json';
import babel from '@rollup/plugin-babel';
import {DEFAULT_EXTENSIONS} from '@babel/core';
import typescript2 from 'rollup-plugin-typescript2';
import sourcemaps from 'rollup-plugin-sourcemaps';
import postcss from 'rollup-plugin-postcss';
// import NpmImport from 'less-plugin-npm-import';
import {visualizer} from 'rollup-plugin-visualizer';
import alias from "rollup-plugin-alias";

const extensions = [...DEFAULT_EXTENSIONS, '.ts', '.tsx'];

const getPlugins = ({ projectPath, tsconfigPath }) => {
  return [
    resolve({
      browser: true,
      preferBuiltins: false,
      extensions: extensions,
    }),
    commonjs(),
    json(),
    image(),
    typescript2({
      clean: true,
      tsconfig: tsconfigPath
        ? tsconfigPath
        : path.resolve(projectPath, 'tsconfig.json'),
      useTsconfigDeclarationDir: true,
      exclude: ['**/__tests__', '**/*.test.ts'],
    }),
    babel({
      rootMode: 'upward',
      babelHelpers: 'runtime',
      extensions: extensions,
      exclude: '**/node_modules/**',
    }),
    sourcemaps(),
    postcss({
      extract: 'styles.css',  // 将所有样式提取到一个 CSS 文件
      minimize: true,      // 压缩 CSS
      // sourceMap: true,     // 生成 SourceMap
      use: ['sass'],       // 使用 SASS 处理器
    }),
    visualizer({
      emitFile: true,
      file: 'stats.html',
    }),
  ];
};

export const autoExternal = (packageNames) => {
  const deps = Array.from(new Set([...packageNames]));
  return [...deps.map((dep) => new RegExp(`^${dep}($|\\/|\\\\)`))];
};

export const createRollupConfig = (opts) => {
  const {
    input,
    pkg,
    projectPath,
    external,
    tsconfigPath,
    plugins = [],
  } = opts || {};

  if (pkg && projectPath) {
    const outputs = [
      {
        input: input ? input : 'src/index.ts',
        output: {
          name: opts.pkg.name,
          file: opts.pkg.main,
          format: 'cjs',
          sourcemap: true,
          exports: 'named',
        },
      },
      {
        input: input ? input : 'src/index.ts',
        output: {
          file: opts.pkg.module,
          format: 'esm',
          sourcemap: true,
          exports: 'named',
        },
      },
    ];

    const defaultExternals = autoExternal([
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.peerDependencies || {}),
      /^core-js/,
      'react',
      'react-dom',
    ]);

    return outputs.map((o) => {
      return {
        ...o,
        external: external ? external : defaultExternals,
        plugins: [...getPlugins({ projectPath, tsconfigPath }), ...plugins, alias({
          entries: [
            {
              find: '@easy-editor/styles',
              replacement: path.resolve(__dirname, '../packages/editor-style/src'), // 样式包路径
            },
          ],
        }),],
      };
    });
  }
};
