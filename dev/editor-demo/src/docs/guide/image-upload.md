---
title: 图片上传
category: 指南
order: 4
description: onImageUpload 两种写法、错误处理、上传生命周期与体积限制
---

# 图片上传

图片功能由 `@textory/extension-image` 提供，已内置在 `@textory/editor` 中，通过 `imageProps` 配置上传行为。

## 最小示例（推荐：返回值风格）

`onImageUpload` 直接返回 URL 字符串或 `Promise<string>`，编辑器自动接管成功/失败/进度：

```jsx
import Editor from '@textory/editor';

render(
  <Editor
    editable
    imageProps={{
      maxFileSize: 5,
      onImageUpload: async ({ file }) => {
        const fd = new FormData();
        fd.append('file', file);
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: fd,
        });
        if (!res.ok) throw new Error('上传失败');
        const data = await res.json();
        return data.url; // 返回最终图片地址
      },
    }}
  />
);
```

返回值风格优势：

- 写法直观，跟普通 `async` 函数一致
- `throw` 自动转为失败 UI（图片节点显示错误占位）
- 无需手动调用 `onSuccess` / `onError`

## 回调风格（兼容旧用法）

如果上传流程涉及第三方组件（如 antd Upload），不方便返回值，可以使用回调风格：返回 `void`，手动调用 `option.onSuccess`：

```jsx
render(
  <Editor
    editable
    imageProps={{
      onImageUpload: ({ file, onSuccess, onError, onProgress }) => {
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
> 回调风格**必须**在失败时调用 `option.onError`。若吞掉错误（try/catch 不转发），图片节点会一直停在「上传中」状态，永远不会切换到错误 UI。

## 错误处理与 UI 状态

上传流程内置三态 UI：

| 状态 | 触发 | 节点外观 |
| --- | --- | --- |
| 上传中 | `onStart` 后立即进入 | 显示进度环 + 半透明预览图 |
| 成功 | 返回 URL / 调用 `onSuccess` | 显示真实图片 |
| 失败 | `throw` / 调用 `onError` | 显示错误占位，可删除重传 |

返回值风格中，任何 `throw` 的 `Error` 都会被自动转发到失败分支：

```
onImageUpload: async ({ file }) => {
  if (file.size > 10 * 1024 * 1024) {
    throw new Error('图片不能超过 10MB'); // 触发失败 UI
  }
  // ...
  return url;
}
```

## 上传生命周期钩子

需要在副作用里做埋点、loading 遮罩等，使用四个钩子：

| 钩子 | 触发时机 | 典型用途 |
| --- | --- | --- |
| `onImageBeforeUpload(file, fileList)` | 上传前 | 校验，返回 `false` 取消上传 |
| `onImageStartUpload()` | 每张图开始上传 | 显示全局 loading |
| `onImageEndUpload()` | 每张图上传完成（成功/失败均触发） | 隐藏 loading |
| `onProgress({ percent })` | 进度变化（仅回调风格需要手动调） | 进度条 |

```jsx
render(
 <Editor
   editable
   imageProps={{
     onImageBeforeUpload: (file) => {
       if (!file.type.startsWith('image/')) {
         alert('只能传图片');
         return false;
       }
       return true;
     },
     onImageStartUpload: () => setUploading(true),
     onImageEndUpload: () => setUploading(false),
     onImageUpload: async ({ file }) => { /* ... */ return url; },
   }}
 /> 
)
```

## 体积与尺寸限制

| Prop | 类型 | 默认值 | 含义 |
| --- | --- | --- | --- |
| `maxFileSize` | `number` | `500` | 单张图片最大体积（KB），超出由 Upload 组件拦截 |
| `minWidth` | `number` | `100` | 最小宽度（px） |
| `minHeight` | `number` | `100` | 最小高度（px） |

## 支持的来源

无需额外配置，三种入口都走同一个 `onImageUpload`：

| 入口 | 触发方式 |
| --- | --- |
| 工具栏「图片」按钮 | 点击 → 选择文件 |
| 粘贴 | 直接 Cmd/Ctrl+V 粘贴图片 |
| 拖拽 | 拖图到编辑器内任意位置 |

## 内部机制：为什么有 uploadKey

图片节点内部使用独立的 `uploadKey` 属性跟踪上传过程，**不依赖节点 `id`**。

原因：若使用方开启了 `@tiptap/extension-unique-id` 等会改写节点 `id` 的插件，上传流程通过 `id` 查找节点会失败（插入时拿到的 id 几毫秒后被改写）。`uploadKey` 在插入时由工具栏生成，独立于 `id`，因此整个上传生命周期内都能稳定定位到节点。

使用方**无需关心** `uploadKey`，仅在自定义扩展直接操作图片节点时需要了解此约定。

## Word 导入的图片

`editor.import(file)` 导入 .docx 时，文档内的图片也会通过 `imageProps.onImageUpload` 上传。单张图失败不会中断整个导入过程，失败的图片在文档中以错误占位显示，可删除后手动重新插入。

详见 [导出能力](/docs/guide/export) 与 [扩展包接入](/docs/guide/extensions)。

## 完整 Prop 列表

```ts
type IImageProps = {
  minWidth: number;
  minHeight: number;
  maxFileSize: number; // KB
  onImageBeforeUpload: (file: File, fileList: File[]) => boolean;
  onImageStartUpload: () => void;
  onImageEndUpload: () => void;
  onImageUpload: (options: {
    file: File;
    onProgress?: (e: { percent: number }) => void;
    onSuccess?: (body: { data: string }) => void;
    onError?: (err: Error) => void;
  }) => void | string | Promise<string>;
  onImagePaste: (url: string) => Promise<{ data: { id: string; url: string } }>;
};
```

完整类型定义见 [类型定义](/docs/api/types)。
