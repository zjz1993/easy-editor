---
title: 文件上传
category: 指南
order: 5
description: fileProps 接入、上传生命周期、体积限制、HTML 序列化
---

# 文件上传

文件附件功能由 `@textory/extension-file` 提供，已内置在 `@textory/editor` 中，通过 `fileProps` 配置上传行为。`@textory/extension-upload` 作为 image 与 file 共享的上传基建（进度插件、paste/drop 分发器），被 `@textory/editor` 在内部注册一次，使用方无需感知。

## 最小示例（推荐：返回值风格）

`onFileUpload` 直接返回 URL 字符串或 `Promise<string>`，编辑器自动接管成功/失败/进度：

```jsx
import Editor from '@textory/editor';

render(
  <Editor
    editable
    fileProps={{
      accept: '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.rar,.txt',
      maxFileSize: 50 * 1024, // KB
      onFileUpload: async ({ file }) => {
        const fd = new FormData();
        fd.append('file', file);
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: fd,
        });
        if (!res.ok) throw new Error('上传失败');
        const data = await res.json();
        return data.url; // 返回文件最终地址
      },
    }}
  />
);
```

返回值风格优势：

- 写法直观，跟普通 `async` 函数一致
- `throw` 自动转为失败 UI（文件节点显示「文件上传失败」占位）
- 无需手动调用 `onSuccess` / `onError`

## 回调风格（兼容旧用法）

如果上传流程涉及第三方组件（如 antd Upload），不方便返回值，可以使用回调风格：返回 `void`，手动调用 `option.onSuccess`：

```jsx
render(
  <Editor
    editable
    fileProps={{
      accept: '.pdf,.doc,.docx',
      maxFileSize: 50 * 1024,
      onFileUpload: ({ file, onSuccess, onError, onProgress }) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/api/upload');
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable && onProgress) {
            onProgress({ percent: (e.loaded / e.total) * 100 });
          }
        };
        xhr.onload = () => {
          if (xhr.status === 200) {
            const url = JSON.parse(xhr.responseText).url;
            onSuccess?.({ data: url });
          } else {
            onError?.(new Error('HTTP ' + xhr.status));
          }
        };
        xhr.onerror = () => onError?.(new Error('network'));
        const fd = new FormData();
        fd.append('file', file);
        xhr.send(fd);
      },
    }}
  />
)
```

> [!IMPORTANT]
> 回调风格**必须**在失败时调用 `option.onError`。若吞掉错误（try/catch 不转发），文件节点会一直停在「上传中」状态，永远不会切换到错误 UI。

## 错误处理与 UI 状态

上传流程内置三态 UI：

| 状态 | 触发 | 节点外观 |
| --- | --- | --- |
| 上传中 | `onStart` 后立即进入 | 显示文件图标 + 名称 + 大小 + 圆形进度环 |
| 成功 | 返回 URL / 调用 `onSuccess` | 卡片稳定显示，可点击 X 删除 |
| 失败 | `throw` / 调用 `onError` | 显示「文件上传失败」占位，可删除重传 |

返回值风格中，任何 `throw` 的 `Error` 都会被自动转发到失败分支：

```jsx
onFileUpload: async ({ file }) => {
  if (file.size > 100 * 1024 * 1024) {
    throw new Error('文件不能超过 100MB'); // 触发失败 UI
  }
  // ...
  return url;
}
```

## 上传生命周期钩子

需要在副作用里做埋点、loading 遮罩等，使用四个钩子：

| 钩子 | 触发时机 | 典型用途 |
| --- | --- | --- |
| `onFileBeforeUpload(file, fileList)` | 上传前 | 校验，返回 `false` 取消上传 |
| `onFileStartUpload()` | 每个文件开始上传 | 显示全局 loading |
| `onFileEndUpload()` | 每个文件上传完成（成功/失败均触发） | 隐藏 loading |
| `onProgress({ percent })` | 进度变化（仅回调风格需要手动调） | 进度环 |

```jsx
render(
  <Editor
    editable
    fileProps={{
      onFileBeforeUpload: (file) => {
        if (file.size === 0) {
          alert('文件为空');
          return false;
        }
        return true;
      },
      onFileStartUpload: () => setUploadingCount((n) => n + 1),
      onFileEndUpload: () => setUploadingCount((n) => n - 1),
      onFileUpload: async ({ file }) => { /* ... */ return url; },
    }}
  />
)
```

## 体积与格式限制

| Prop | 类型 | 默认值 | 含义 |
| --- | --- | --- | --- |
| `accept` | `string` | `'*'` | 文件选择框 accept 属性，逗号分隔扩展名（如 `'.pdf,.docx'`） |
| `maxFileSize` | `number` | `51200` | 单个文件最大体积（**KB**），超出由 Upload 组件拦截 |

> [!NOTE]
> `accept` 仅约束工具栏文件选择框。粘贴/拖拽入口不校验扩展名——浏览器 MIME 不可信，校验应在 `onFileBeforeUpload` 中自行实现。

## 支持的来源

| 入口 | 触发方式 | 是否可关闭 |
| --- | --- | --- |
| 工具栏「附件」按钮（`icon-clip`） | 点击 → 选择文件 | 设 `features.fileUpload=false` 移除按钮 |
| 粘贴 | 直接 Cmd/Ctrl+V 粘贴非图片/视频文件 | 跟随 `features.fileUpload` |
| 拖拽 | 拖文件到编辑器内任意位置 | 跟随 `features.fileUpload` |

> [!IMPORTANT]
> 图片和文件使用独立的 paste/drop 分支。同一次粘贴同时含图片和文件时，**第一个识别成功的类型会 preventDefault**，阻断后续分发。粘贴截图会走图片通道，粘贴 .docx 会走文件通道。

## 功能开关

```jsx
<Editor features={{ fileUpload: false }} />
```

`features.fileUpload` 默认 `true`。设为 `false` 后：

- 工具栏不渲染附件按钮
- `FileExtension` 不注册（节点类型不存在）
- 粘贴/拖拽非图片文件不会触发上传

> [!IMPORTANT]
> `features` **仅在 mount 时生效**。运行时切换需给 `<Editor>` 加 `key` 强制 remount，参见 [Editor API · 功能开关](/docs/api/editor#功能开关features)。

## HTML 序列化

文件节点序列化为标准 `<a>` 标签：

```html
<a href="https://cdn.example.com/foo.pdf" download="foo.pdf" data-file-size="123456">foo.pdf</a>
```

- `href`：下载 URL（对应 `attrs.src`）
- `download`：建议保存的文件名（对应 `attrs.name`）
- `data-file-size`：文件字节数（对应 `attrs.size`）
- 标签内文本：文件名

这保证：

- `editor.getHTML()` 拿到的内容能被外部消费者（如 Markdown 转换器、外部预览页）识别为普通链接
- `setContent(html)` 再次注入时，文件节点能通过 `parseHTML` 规则恢复

## 内部机制：uploadKey

文件节点内部使用独立的 `uploadKey` 属性跟踪上传过程，**不依赖节点 `id`**。原因与图片一致：若使用方开启了 `@tiptap/extension-unique-id` 等会改写节点 `id` 的插件，上传流程通过 `id` 查找节点会失败。使用方**无需关心** `uploadKey`。

## 节点属性

```ts
type FileNodeAttributes = {
  src?: string;        // 下载 URL，上传中为空
  name?: string;       // 文件名（含扩展名）
  size?: number;       // 文件字节数
  ext?: string;        // 小写扩展名（无点，如 'pdf'）
  uploadKey?: string;  // 上传追踪 key，独立于 id
  id?: string;         // 节点 id
  isError?: boolean;   // 是否显示错误占位
};
```

## 完整 Prop 列表

```ts
type IFileProps = {
  accept?: string;
  maxFileSize: number; // KB
  onFileBeforeUpload: (file: File, fileList: File[]) => boolean;
  onFileStartUpload: () => void;
  onFileEndUpload: () => void;
  onFileUpload: (options: {
    file: File;
    onProgress?: (e: { percent: number }) => void;
    onSuccess?: (body: { data: string }) => void;
    onError?: (err: Error) => void;
  }) => void | string | Promise<string>;
};
```

完整类型定义见 [类型定义](/docs/api/types)。
