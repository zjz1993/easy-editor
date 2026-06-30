import Editor from './root.tsx';
import type {TEasyEditorProps} from '@textory/context';

// 导出 DOCX 功能（独立函数，可不依赖 Editor 实例使用）
export { exportWORD } from '@textory/extension-export';
export type { ExportOptions, IExportWatermark } from '@textory/extension-export';

// 导出 Editor ref 句柄类型（用于 editorRef.current.export() 调用）
export type { EditorRef } from './root.tsx';

export default Editor;
export type { TEasyEditorProps };
