// dumi 风格 demo 容器：jsx 代码块自动渲染为「预览 + 折叠源码」
import Editor from '@textory/editor';
import {
  LiveProvider,
  LivePreview,
  LiveError,
} from 'react-live';
import { Highlight, themes } from 'prism-react-renderer';
import { Link } from 'react-router-dom';
import * as React from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { FC } from 'react';
import { DEMO_HTML } from '../data/demoContent';

interface DemoBlockProps {
  code: string;
  lang?: string;
}

/**
 * 把「组件模块」形式的示例代码转成 react-live 可执行的代码。
 * 支持：
 *   1. export default function|class Name ...   → 保留声明，补 render(<Name />)
 *   2. export default Identifier;               → 删掉该行，补 render(<Identifier />)
 *   3. export default <匿名表达式>;             → 转成 const __TextoryDemo = <expr>; render(<__TextoryDemo />)
 * 不含 export default 时返回 null。
 */
const adaptExportDefault = (code: string): string | null => {
  // 1. export default function|class Name
  let m = code.match(/\bexport\s+default\s+(?:function|class)\s+(\w+)/);
  if (m) {
    const name = m[1];
    return (
      code.replace(/\bexport\s+default\s+(?=function|class)/, '') +
      `\nrender(<${name} />);`
    );
  }
  // 2. export default Identifier;  (单独一行的命名导出)
  m = code.match(/\bexport\s+default\s+(\w+)\s*;?[ \t]*$/m);
  if (m) {
    const name = m[1];
    const stripped = code
      .replace(/\bexport\s+default\s+\w+\s*;?[ \t]*$/m, '')
      .trim();
    return `${stripped}\nrender(<${name} />);`;
  }
  // 3. export default <匿名表达式>
  m = code.match(/\bexport\s+default\s+([\s\S]+?);?\s*$/);
  if (m) {
    const expr = m[1].trim().replace(/;$/, '');
    const stripped = code
      .replace(/\bexport\s+default\s+[\s\S]*$/, '')
      .trim();
    return `${stripped}\nconst __TextoryDemo = ${expr};\nrender(<__TextoryDemo />);`;
  }
  return null;
};

/**
 * 把自由形式的 jsx 代码自动包装成 react-live 可执行的代码。
 * 免去用户手写 `render(...)` 的负担。支持两类常见场景：
 *
 *   1. 单个 JSX 表达式（含前置注释）：
 *        ```jsx
 *        // 关闭文档大纲
 *        <Editor features={{ outline: false }} />
 *        ```
 *      → `render(<Editor features={{ outline: false }} />);`
 *
 *   2. 多语句 + 末尾 JSX（含 hooks 调用）：
 *        ```jsx
 *        const [on, setOn] = useState(true);
 *        <Editor features={{ outline: on }} />
 *        ```
 *      → 包装成函数组件，让 hooks 落到组件体内：
 *        `function __TextoryDemo() {`
 *        `  const [on, setOn] = useState(true);`
 *        `  return (<Editor features={{ outline: on }} />);`
 *        `}`
 *        `render(<__TextoryDemo />);`
 *
 * 注意：react-live 的 noInline 模式把代码作为模块顶层执行，
 * 直接在顶层调用 useState/useRef/useEffect 等 hooks 违反 Hooks 规则，
 * 必须包成组件函数。
 *
 * 不处理含 `function/class` 组件定义的代码（应使用 `export default` 或显式 `render(...)`）。
 */
const adaptFreeForm = (code: string): string => {
  // 剥离注释用于结构分析（实际执行保留原代码）
  const stripped = code
    .replace(/\/\/[^\n]*/g, '') // 行注释
    .replace(/\/\*[\s\S]*?\*\//g, '') // 块注释
    .trim();

  if (!stripped) return code;

  // 启发式 1：单个表达式（无分号、无语句关键字）→ 直接 wrap
  const looksLikeExpression =
    !/;/.test(stripped) &&
    !/\b(?:const|let|var|function|class|if|for|while|return|switch|throw|try)\b/.test(
      stripped,
    );

  if (looksLikeExpression) {
    return `render(${stripped});`;
  }

  // 启发式 2：多语句，分离前置语句与末尾 JSX
  // 必须包成函数组件：前置语句作为函数体，末尾 JSX 作为 return 值
  // 这样 useState/useRef/useEffect 等 hooks 才会落到组件函数体内（否则违反 Hooks 规则）
  const lastSemicolon = stripped.lastIndexOf(';');
  if (lastSemicolon !== -1) {
    const prefix = stripped.slice(0, lastSemicolon + 1).trim();
    const tail = stripped.slice(lastSemicolon + 1).trim();
    if (tail.startsWith('<')) {
      const indentedBody = prefix
        .split('\n')
        .map((l) => `  ${l}`)
        .join('\n');
      return [
        'function __TextoryDemo() {',
        indentedBody,
        `  return (${tail});`,
        '}',
        'render(<__TextoryDemo />);',
      ].join('\n');
    }
  }

  // 兜底：无法识别，原样返回，让 react-live 报错提示用户
  return code;
};

// 把代码作为 react-live 的 scope 注入（与 PlaygroundPage 保持一致）
const DemoBlock: FC<DemoBlockProps> = ({ code, lang = 'jsx' }) => {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const scope = useMemo(
    () => ({
      Editor,
      React,
      useState,
      useRef,
      useEffect,
      useMemo,
      useCallback,
      DEMO_HTML,
    }),
    [],
  );

  // 代码块运行时实际执行的代码：
  // 1. 去掉 import 语句（Editor / hooks 等已通过 scope 注入，import 在 react-live 里无法执行）
  // 2. 若用户已显式调用 render(...)，按原样执行（支持多语句、hooks）
  // 3. 若是组件模块（含 export default），去掉 export 并补上 render(<组件名 />)
  // 4. 否则交给 adaptFreeForm 智能识别单 JSX / 多语句 + 末尾 JSX
  const runtimeCode = useMemo(() => {
    const noImports = code
      .replace(/^\s*import\s[\s\S]*?;\s*$/gm, '')
      .trim();
    if (!noImports) return '';
    if (/\brender\s*\(/.test(noImports)) return noImports;
    const adapted = adaptExportDefault(noImports);
    if (adapted) return adapted;
    return adaptFreeForm(noImports);
  }, [code]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  };

  return (
    <div className="docs-demo">
      <LiveProvider code={runtimeCode} scope={scope} noInline>
        <div className="docs-demo__preview">
          <LivePreview />
          <LiveError className="docs-demo__error" />
        </div>
      </LiveProvider>

      <div className="docs-demo__toolbar">
        <button
          type="button"
          className="docs-demo__btn"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
        >
          {expanded ? '隐藏代码' : '查看代码'}
        </button>
        <button type="button" className="docs-demo__btn" onClick={handleCopy}>
          {copied ? '已复制 ✓' : '复制'}
        </button>
        <Link
          className="docs-demo__btn docs-demo__btn--link"
          to="/playground"
          title="在演练场中打开"
        >
          演练场 ↗
        </Link>
      </div>

      {expanded && (
        <Highlight code={code.trim()} language={lang} theme={themes.nightOwlLight}>
          {({ className, style, tokens, getLineProps, getTokenProps }) => (
            <pre className={`${className} docs-demo__code`} style={style}>
              {tokens.map((line, i) => {
                const lineProps = getLineProps({ line });
                return (
                  <div key={i} {...lineProps}>
                    {line.map((token, key) => (
                      <span key={key} {...getTokenProps({ token })} />
                    ))}
                  </div>
                );
              })}
            </pre>
          )}
        </Highlight>
      )}
    </div>
  );
};

export default DemoBlock;
