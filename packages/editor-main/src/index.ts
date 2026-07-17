import Editor from './root.tsx';
import type {TEasyEditorProps} from '@textory/context';

// 导出 DOCX 功能（独立函数，可不依赖 Editor 实例使用）
export { exportWORD } from '@textory/extension-export';
export type { ExportOptions, IExportWatermark } from '@textory/extension-export';

// 导入 DOCX 功能（独立函数，可不依赖 Editor 实例使用）
export { importWORD, docxToHTML } from '@textory/extension-import-word';
export type { ImportWORDOptions, DocxToHTMLOptions } from '@textory/extension-import-word';

// 导出 Editor ref 句柄类型（用于 editorRef.current.export() 调用）
export type { EditorRef } from './root.tsx';

// 导出 features 相关常量与类型，便于使用方强类型构造 features prop
export { FEATURES } from '@textory/context';
export type { FeatureName, FeatureFlags } from '@textory/context';

export default Editor;
export type { TEasyEditorProps };
