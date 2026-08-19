import { defineConfig } from "tsup";
import baseConfig from "../../tsup.config.base";

// 额外暴露 constants 叶子入口：供扩展包按需引入 BLOCK_TYPES 等常量，
// 避免拉起主入口（会连带 editor-common-ui 的 iconfont 副作用）。
// 注意：必须用 defineConfig 包裹。直接导出 {...baseConfig} 的展开对象，
// 其推断类型会引用 esbuild/rollup 等 tsup 的传递依赖（pnpm 下无法可移植命名），触发 TS2742/TS2883。
export default defineConfig({
  ...baseConfig,
  entry: ["src/index.ts", "src/constants.ts"],
});
