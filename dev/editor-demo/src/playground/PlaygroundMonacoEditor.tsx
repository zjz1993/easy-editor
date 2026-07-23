// Playground 代码编辑器(Monaco 封装)
//
// 用 Monaco Editor 替换 react-live 默认的 LiveEditor,提供完整 TS IntelliSense:
// - 自动补全、悬停提示、签名帮助、JSX 类型检查
// - 通过 monacoSetup.ts 注入 ambient d.ts,让 scope 内的 Editor/hooks/render 有类型
//
// react-live 仍负责执行,LiveProvider/LivePreview/LiveError 在外层不变。

import { Suspense, lazy, type FC } from 'react';
import { initMonaco } from './monacoSetup';

// Monaco 体积大(~2.5MB),先做 setup 再 dynamic import @monaco-editor/react
const MonacoReact = lazy(async () => {
  initMonaco();
  const mod = await import('@monaco-editor/react');
  return { default: mod.Editor };
});

interface Props {
  value: string;
  onChange: (code: string) => void;
}

const PlaygroundMonacoEditor: FC<Props> = ({ value, onChange }) => {
  return (
    <Suspense
      fallback={
        <div className="playground-editor__loading">加载编辑器…</div>
      }
    >
      <MonacoReact
        className="playground-editor"
        path="file:///playground.tsx"
        value={value}
        language="typescript"
        theme="vs-dark"
        onChange={(v) => onChange(v ?? '')}
        options={{
          minimap: { enabled: false },
          fontSize: 13,
          lineHeight: 20,
          tabSize: 2,
          automaticLayout: true,
          scrollBeyondLastLine: false,
          wordWrap: 'on',
          padding: { top: 12 },
          fixedOverflowWidgets: true,
          quickSuggestions: { other: true, comments: false, strings: true },
          suggestOnTriggerCharacters: true,
          smoothScrolling: true,
          suggest: {
            showWords: true,
            showSnippets: true,
            showFunctions: true,
            showVariables: true,
            showClasses: true,
            showModules: true,
            showProperties: true,
            showEvents: true,
            showOperators: true,
            showUnits: true,
            showValues: true,
            showConstants: true,
            showEnums: true,
            showEnumMembers: true,
            showKeywords: true,
            showColors: true,
            showFiles: true,
            showReferences: true,
            showFolders: true,
            showTypeParameters: true,
            showIssues: true,
            showUsers: true,
          },
        }}
      />
    </Suspense>
  );
};

export default PlaygroundMonacoEditor;
