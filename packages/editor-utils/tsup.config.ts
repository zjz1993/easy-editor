import baseConfig from "../../tsup.config.base";

// 额外暴露 constants 叶子入口：供扩展包按需引入 BLOCK_TYPES 等常量，
// 避免拉起主入口（会连带 editor-common-ui 的 iconfont 副作用）。
export default {
  ...baseConfig,
  entry: ["src/index.ts", "src/constants.ts"],
};
