// Monaco 编辑器初始化
//
// - 注册 web worker(editor / json / css / html / ts)
// - 把本地 monaco-editor 实例交给 @monaco-editor/react,避免走 CDN
// - 配置 TS 编译选项(jsx、ESM、esModuleInterop)
// - 注入 playground ambient d.ts,让 scope 内的变量(Editor/hooks/DEMO_HTML/render)获得类型
//
// 调用 initMonaco() 幂等,HMR 下重复执行只生效一次。

import * as monaco from 'monaco-editor';
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';
import { loader } from '@monaco-editor/react';
import { AMBIENT_DTS } from './playgroundAmbient.ts';

let initialized = false;

const setupWorkers = () => {
  (self as unknown as { MonacoEnvironment: Record<string, unknown> }).MonacoEnvironment = {
    getWorker(_workerId: string, label: string) {
      if (label === 'json') return new jsonWorker();
      if (label === 'css' || label === 'scss' || label === 'less') {
        return new cssWorker();
      }
      if (label === 'html' || label === 'handlebars' || label === 'razor') {
        return new htmlWorker();
      }
      if (label === 'typescript' || label === 'javascript') {
        return new tsWorker();
      }
      return new editorWorker();
    },
  };
};

const setupTypeScriptDefaults = () => {
  const defaults = monaco.languages.typescript.typescriptDefaults;
  defaults.setCompilerOptions({
    target: monaco.languages.typescript.ScriptTarget.ESNext,
    allowNonTsExtensions: true,
    moduleResolution:
      monaco.languages.typescript.ModuleResolutionKind.NodeJs,
    module: monaco.languages.typescript.ModuleKind.ESNext,
    jsx: monaco.languages.typescript.JsxEmit.React,
    esModuleInterop: true,
    allowJs: true,
    noEmit: true,
  });
  defaults.setEagerModelSync(true);
  defaults.setDiagnosticsOptions({
    noSemanticValidation: false,
    noSyntaxValidation: false,
  });
  defaults.addExtraLib(AMBIENT_DTS, 'file:///playground-env.d.ts');
};

export const initMonaco = (): void => {
  if (initialized) return;
  initialized = true;

  setupWorkers();
  setupTypeScriptDefaults();
  loader.config({ monaco });
};
