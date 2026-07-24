import {Extension} from '@tiptap/core';

/**
 * 文档元数据扩展。
 *
 * 把「文档标题」这类不属于 ProseMirror doc 本体、但与 editor 实例
 * 生命周期一致的元数据放进 `editor.storage.docMeta`，让 export /
 * import / autosave 等场景无需 React 上下文即可读取。
 *
 * 注意：storage 不是响应式的，改值不会触发 React re-render。
 * 仅适合「写入偶尔，读取事件时」的场景（例如点击导出按钮时读 title）。
 * 需要响应式 UI 的组件仍应通过 React props/state 订阅。
 *
 * 同步规则：
 * - 初始值由 root.tsx 通过 configure({ title }) 传入
 * - DocTitle 用户输入时由 root.tsx 同步写入 storage
 * - 任何代码都可通过 `editor.storage.docMeta.title` 读取
 */
export interface DocMetaStorage {
  title: string;
}

export interface DocMetaOptions {
  title: string;
}

export const DocMetaExtension = Extension.create<DocMetaOptions, DocMetaStorage>({
  name: 'docMeta',

  addOptions() {
    return {
      title: '',
    };
  },

  addStorage() {
    return {
      title: this.options.title,
    };
  },
});
