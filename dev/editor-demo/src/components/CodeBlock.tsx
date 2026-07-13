// 静态代码块高亮（非 jsx 代码块或 demo 块的 fallback）
import { Highlight, themes } from 'prism-react-renderer';
import type { FC } from 'react';

interface CodeBlockProps {
  code: string;
  lang?: string;
}

const CodeBlock: FC<CodeBlockProps> = ({ code, lang = 'text' }) => {
  return (
    <Highlight code={code.trim()} language={lang} theme={themes.nightOwlLight}>
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre className={`${className} docs-code`} style={style}>
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
  );
};

export default CodeBlock;
