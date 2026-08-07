---
'@textory/standalone': minor
'@textory/editor': minor
'@textory/context': minor
---

feat: 新增 @textory/standalone 包,支持通过 <script> 标签在非 React 环境引入编辑器

- 新包 @textory/standalone: 暴露 window.Textory 全局,提供 Textory.create(element, options) 工厂
- 双 IIFE 产物:
  - textory.standalone.min.js (all-in-one,~2MB minified)
  - textory.externals.min.js (外置 React/ReactDOM,~1.9MB minified)
- CSS 单独引: textory.min.css
- instance API: getHTML/setHTML/getJSON/setJSON/focus/blur/clear/setOptions/destroy + .editor escape hatch
- 5 个回调: onChange(html)/onCreate/onFocus/onBlur/onError
- 双轨上传: 简单 upload.image(file)→url + 完整 imageProps/videoProps/fileProps escape hatch
- @textory/editor / @textory/context 新增 onEditorReady prop,供 UMD 桥接层拿原始 Tiptap Editor 引用
