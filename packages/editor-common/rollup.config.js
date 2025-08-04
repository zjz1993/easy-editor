import replace from '@rollup/plugin-replace';
import copy from 'rollup-plugin-copy';
import {createRollupConfig} from '../../scripts/rollup.common';
import packageJson from './package.json'; // 获取基础配置

// 获取基础配置
const baseConfigs = createRollupConfig({
  pkg: packageJson,
  projectPath: __dirname,
  plugins: [
    copy({
      targets: [
        {
          src: 'src/components/IconFont/assets/iconfont.js',
          dest: 'dist/assets',
        },
      ],
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify(
        process.env.NODE_ENV || 'development',
      ),
      preventAssignment: true,
    }),
  ],
});

// 添加类型声明配置
// const typesConfig = {
//   input: 'src/index.ts',
//   output: [
//     {
//       file: packageJson.types,
//       format: 'es',
//     },
//   ],
//   plugins: [dts()],
// };

export default [...(Array.isArray(baseConfigs) ? baseConfigs : [baseConfigs])];
