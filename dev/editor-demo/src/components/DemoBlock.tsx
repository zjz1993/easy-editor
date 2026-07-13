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
  // 4. 否则把整段代码当作单个 JSX 表达式，自动包裹 render(...)
  const runtimeCode = useMemo(() => {
    const noImports = code
      .replace(/^\s*import\s[\s\S]*?;\s*$/gm, '')
      .trim();
    if (!noImports) return '';
    if (/\brender\s*\(/.test(noImports)) return noImports;
    const adapted = adaptExportDefault(noImports);
    if (adapted) return adapted;
    return `render(${noImports});`;
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
