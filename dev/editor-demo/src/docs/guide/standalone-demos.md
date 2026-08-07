---
title: Standalone 在线示例
category: 指南
order: 9
description: 在文档里直接体验 standalone UMD bundle 的 5 个场景
---

# Standalone 在线示例

下面 5 个示例直接复用 `dev/standalone-demo/` 下的 HTML，通过 iframe 嵌入到文档里。每个示例都是独立 HTML，复现真实 CDN 用户场景。

> [!TIP]
> 这些 iframe 加载的是同源 `/standalone-demo/*.html`，背后由 editor-demo 的 dev server 通过 middleware 直接服务 `dev/standalone-demo/` 目录与 `packages/standalone/dist/` 构建产物。
>
> 想看完整 HTML 源码：[dev/standalone-demo/](https://github.com/anthropics/easy-editor/tree/main/dev/standalone-demo) 或本仓库 `dev/standalone-demo/` 目录。

## 1. 基础用法

引一个 CSS + 一个 JS，开箱即用。验证 `getHTML` / `setHTML` / `destroy`。

<standalone-iframe src="basic.html" title="基础用法" />

## 2. Externals 模式

页面已有 React，用 `textory.externals.min.js` 共用一份 React 实例。

<standalone-iframe src="external-react.html" title="Externals 模式" />

## 3. 自定义上传适配器

通过 `upload.image` / `upload.file` 简化 API 接入自定义上传通道。本例用 dataURL 模拟。

<standalone-iframe src="upload.html" title="自定义上传适配器" />

## 4. Features 开关

`features` 对象按需关闭某些功能（outline / importWord / fileUpload / videoUpload 等）。

<standalone-iframe src="features.html" title="Features 开关" />

## 5. destroy 与重建

`destroy()` 卸载编辑器、释放 React root。destroy 后任何方法调用仅 `console.warn`，不 throw。

<standalone-iframe src="destroy.html" title="destroy 与重建" />

## 离线本地运行

iframe 内是同源服务，不需要单独启动 `pnpm start:standalone`。如果想脱离 editor-demo 单独验证，仓库也提供独立的 standalone-demo dev server：

```bash
pnpm start:standalone
# 访问 http://localhost:5174
```

完整 HTML 代码与构建约束见 [script 标签引入](./script-tag.md) 与 [Standalone API](../api/standalone.md)。
