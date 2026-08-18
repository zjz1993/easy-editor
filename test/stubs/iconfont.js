// vitest 专用 stub：真实 iconfont.js 在 import 时执行 DOM 注入脚本，
// 在 happy-dom 下崩溃（document.getElementById 返回 undefined 后调
// getAttribute）。凡经 @textory/editor-utils 主 barrel 间接加载
// editor-common-ui 的测试都会触发（见 vitest.config.ts 的 alias）。
// 图标渲染依赖的 CSS class 不受影响，仅跳过 SVG sprite 注入副作用。
export default {};
