const { defineConfig } = require('@rspack/cli');
const isProduction = process.env.NODE_ENV === 'production';
const path = require('node:path');

const build = require(path.join(__dirname, '../../scripts/build.js'));

/** @type {import('@rspack/cli').Configuration} */
module.exports = defineConfig(
  build({
    dirname: path.join(__dirname),
    entry: path.join(__dirname, './src/index.ts'),
    mode: isProduction ? 'production' : 'development',
  }),
);
