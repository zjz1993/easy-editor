# @textory/editor

基于 [Tiptap](https://www.tiptap.dev/) 的模块化富文本编辑器，采用 TypeScript + pnpm workspaces 的 monorepo 架构，每个功能以独立扩展包的形式提供，可按需组合。

## 特性

- **模块化**：加粗、链接、图片、表格、代码块、任务列表、大纲等都是独立的扩展包
- **开箱即用**：直接使用 `@textory/editor` 即可获得完整编辑器，也可按需引入单个扩展
- **React 友好**：基于 React Context 进行状态分发，提供 hooks 访问编辑器实例
- **图片上传**：内置上传进度、粘贴上传、失败重试、自定义上传函数
- **表格编辑**：内置浮动菜单（BubbleMenu）优化表格操作体验
- **只输出 ESM**：构建产物仅包含 ESM，便于现代打包器 tree-shaking

## 安装

```bash
# npm
npm install @textory/editor

# pnpm
pnpm add @textory/editor

# yarn
yarn add @textory/editor
```

`@textory/editor` 的 `dependencies` 会自动拉取所需的 `@textory/*` 子包；
`peerDependencies`（React、React DOM、`@tiptap/*` 等）在 npm 7+/pnpm 8+ 下会自动安装。
如果你使用较旧的包管理器或希望显式控制版本，可手动安装：

```bash
pnpm add react react-dom @tiptap/core @tiptap/pm @tiptap/react @tiptap/starter-kit
```

同时别忘了引入样式：

```ts
import '@textory/editor/theme/normal.css';
```

样式文件与 JS 代码分离，构建后通过子路径 `@textory/editor/theme/normal.css` 单独引入。如果以后多主题，扩展为 `@textory/editor/theme/dark.css` 等。

## 快速开始

```tsx
import Editor from '@textory/editor';
import '@textory/editor/theme/normal.css';

function App() {
  return (
    <Editor
      placeholder="请输入正文"
      editable
      onChange={(content, title) => {
        console.log('HTML：', content.html);
        console.log('JSON：', content.json);
        console.log('标题：', title);
      }}
      imageProps={{
        maxFileSize: 5 * 1024 * 1024,
        onImageUpload: async ({ file, onSuccess, onError }) => {
          const fd = new FormData();
          fd.append('file', file as File);

          try {
            const res = await fetch('/api/upload', {
              method: 'POST',
              body: fd,
            }).then((r) => r.json());

            onSuccess?.({ data: { id: res.id, url: res.url } });
          } catch (err) {
            onError?.(err as any);
          }
        },
      }}
    />
  );
}

export default App;
```

## Props

| 属性          | 类型                                  | 说明                                                                 |
| ------------- | ------------------------------------- | -------------------------------------------------------------------- |
| `content`     | `string \| JSONContent`               | 初始内容，HTML 字符串或 Tiptap JSON                                  |
| `onChange`    | `(content: { html: string, json: JSONContent }, title: string) => void` | 内容变化回调，同时返回 HTML 与 ProseMirror JSON；`title` 为标题输入框当前值 |
| `editable`    | `boolean`                             | 是否可编辑                                                           |
| `placeholder` | `string`                              | 占位文本                                                             |
| `autoFocus`   | `boolean`                             | 自动聚焦                                                             |
| `imageProps`  | `Partial<IImageProps>`                | 图片相关配置：上传函数、文件大小限制、尺寸限制等                     |
| `className`   | `string`                              | 外层容器类名                                                         |
| `style`       | `CSSProperties`                       | 外层容器样式                                                         |

## 包结构

| 包名                             | 目录                          | 说明                                |
| -------------------------------- | ----------------------------- | ----------------------------------- |
| `@textory/editor`                | `packages/editor-main`        | 主入口，组合所有扩展                |
| `@textory/context`               | `packages/editor-context`     | React Context、类型与 hooks         |
| `@textory/editor-common`         | `packages/editor-common`      | 共享工具、常量、通用组件            |
| `@textory/editor-toolbar`        | `packages/editor-toolbar`     | 模块化工具栏                        |
| `@textory/styles`                | `packages/editor-style`       | 共享 SCSS 样式                      |
| `@textory/extension-bold`        | `packages/extension-bold`     | 加粗                                |
| `@textory/extension-code-block`  | `packages/extension-code-block` | 代码块（基于 lowlight）             |
| `@textory/extension-image`       | `packages/extension-image`    | 图片插入、上传与预览                |
| `@textory/extension-indent`      | `packages/extension-indent`   | 缩进                                |
| `@textory/extension-link`        | `packages/extension-link`     | 超链接                              |
| `@textory/extension-outline`     | `packages/extension-outline`  | 文档大纲                            |
| `@textory/extension-table`       | `packages/extension-table`    | 表格 + 浮动菜单                     |
| `@textory/extension-task-item`   | `packages/extension-task-item` | 任务列表                            |

## 本地开发

```bash
# 安装依赖
pnpm install

# 启动 demo（dev/editor-demo）
pnpm start

# 构建所有发布包
pnpm build

# 仅构建某个包
pnpm --filter @textory/extension-bold build
```

环境要求：

- Node.js ≥ 18
- pnpm ≥ 8（推荐使用项目指定的 9.13.0）

## License

ISC
