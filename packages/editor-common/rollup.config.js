import replace from '@rollup/plugin-replace';
import copy from 'rollup-plugin-copy';
import { createRollupConfig } from '../../scripts/rollup.common';
import packageJson from './package.json';

export default createRollupConfig({
  pkg: packageJson,
  projectPath: __dirname,
  plugins: [
    copy({
      targets: [
        {
          src: 'src/components/IconFont/assets/iconfont.js',
          dest: 'dist/assets',
        }, // 复制 iconfont.js
      ],
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify(
        process.env.NODE_ENV || 'development',
      ), // 替换环境变量
      preventAssignment: true, // 防止错误替换
    }),
  ],
});
