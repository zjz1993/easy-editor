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
          src: 'src/*.scss',
          dest: 'dist/styles',
          // transform: contents =>
          //   contents
          //     .toString()
          //     .replaceAll(/^@import.+/g, '')
          //     .trimStart(),
        },
      ],
    }),
  ],
});
