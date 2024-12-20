const {resolve} = require("node:path");
const createBuildConfig = ({entry,mode, dirname}) => {
  /** @type {import('@rspack/cli').Configuration} */
  return {
    experiments: {
      css: true,
    },
    entry,
    mode,
    resolve: {
      alias:{
        "@": resolve(__dirname, './src'),
      },
      extensions: ['.ts', '.js', '.tsx','.scss'],
    },
    target: 'web',
    module: {
      rules: [
        {
          test: /\.jsx$/,
          use: {
            loader: 'builtin:swc-loader',
            options: {
              jsc: {
                parser: {
                  syntax: 'ecmascript',
                  jsx: true,
                },
              },
            },
          },
          type: 'javascript/auto',
        },
        {
          test: /\.tsx$/,
          use: {
            loader: 'builtin:swc-loader',
            options: {
              jsc: {
                parser: {
                  syntax: 'typescript',
                  tsx: true,
                },
              },
            },
          },
          type: 'javascript/auto',
        },
        {
          test: /\.ts$/,
          exclude: [/node_modules/],
          loader: 'builtin:swc-loader',
          options: {
            jsc: {
              parser: {
                syntax: 'typescript',
              },
            },
          },
          type: 'javascript/auto',
        },
        {
          test: /\.(sass|scss)$/,
          use: [
            {
              loader: 'sass-loader',
              options: {
                // 同时使用 `modern-compiler` 和 `sass-embedded` 可以显著提升构建性能
                // 需要 `sass-loader >= 14.2.1`
                api: 'modern-compiler',
                implementation: require.resolve('sass-embedded'),
              },
            },
          ],
          type: "css",
        },
      ],
    },
  }
}
module.exports = createBuildConfig;
