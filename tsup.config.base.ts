import {defineConfig} from "tsup";
// 新增：SCSS 支持
import {sassPlugin} from "esbuild-sass-plugin";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  dts: true,
  sourcemap: true,
  clean: true,

  // 确保一次性构建：显式关闭 watch
  watch: false,

  // 改为打包资源，以便处理样式与图片
  bundle: true,
  // 外部化 peer 依赖，避免把 React/Tiptap 打进来
  external: [
    "react",
    "react-dom",
    /^@tiptap\/.*/,
    /^@easy-editor\/.*/,
    // ⭐️ 必须加
    "use-sync-external-store",
    "use-sync-external-store/shim",
    "use-sync-external-store/shim/index.js"
  ],
  platform: "browser",
  splitting: false,
  // 抽取独立 CSS 文件（与入口同名）
  injectStyle: false,
  // 现代目标；如需更老浏览器，建议额外接入 Babel 再处理 CJS 产物
  target: "es2018",
  // 资源处理（按需可改为 "file"）
  loader: {
    ".png": "dataurl",
    ".jpg": "dataurl",
    ".svg": "dataurl",
  },
  // 启用 SCSS 编译
  esbuildPlugins: [
    sassPlugin({
      type: "css",
    }),
  ],
  outDir: "dist",
});
