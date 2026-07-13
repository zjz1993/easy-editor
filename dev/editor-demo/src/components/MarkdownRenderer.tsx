// react-markdown 包装：注册 GFM、callouts、标题锚点等插件 + 自定义组件映射
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkGithubBlockquoteAlert from 'remark-github-blockquote-alert';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import type { FC } from 'react';
import DemoBlock from './DemoBlock';
import CodeBlock from './CodeBlock';
import { getDemoSource } from '../utils/docsGraph';

interface MarkdownRendererProps {
  content: string;
}

/**
 * 把 dumi 风格的 <code src="..."> 引用展开为围栏代码块。
 * 路径以 docs 为根目录，例如 <code src="demo/demo1.tsx" />。
 * 找不到文件时插入一个醒目的 GFM 警告块。
 */
const expandCodeSrc = (content: string): string => {
  return content.replace(
    /<code\s+src=["']([^"']+)["']\s*\/?>(?:<\/code>)?/g,
    (_match, src: string) => {
      const code = getDemoSource(src);
      if (code === null) {
        return `\n\n> [!WARNING]\n> 找不到示例文件：\`${src}\`\n\n`;
      }
      const lang = src.match(/\.(\w+)$/)?.[1].toLowerCase() || 'text';
      return '\n\n```' + lang + '\n' + code.trim() + '\n```\n\n';
    },
  );
};

/**
 * 判断 jsx/tsx 代码块是否可运行：
 * - 去掉注释、import 语句、空白后，若仍有实际代码 → 可运行（交由 DemoBlock 自动包裹 render）
 * - 若只剩注释/import（如 `import Editor from '...';` 或 `// 默认已启用`） → 静态展示
 */
function isRunnableJsx(code: string): boolean {
  const stripped = code
    .replace(/\/\/[^\n]*/g, '') // 行注释
    .replace(/\/\*[\s\S]*?\*\//g, '') // 块注释
    .replace(/^\s*import\s[\s\S]*?;\s*$/gm, '') // import 语句
    .trim();
  return stripped.length > 0;
}

const MarkdownRenderer: FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <div className="docs-content">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkGithubBlockquoteAlert]}
        rehypePlugins={[
          rehypeSlug,
          [
            rehypeAutolinkHeadings,
            {
              behavior: 'append',
              properties: {
                className: 'docs-anchor',
                ariaHidden: 'true',
                tabIndex: -1,
              },
              content: { type: 'text', value: '#' },
            },
          ],
        ]}
        components={{
          // react-markdown v9+: code 组件同时被 inline 和 block 调用
          // 通过 className 是否含 language-X 与是否有换行来区分
          pre({ children }) {
            return <>{children}</>;
          },
          code({ className, children, ...rest }) {
            const match = /language-(\w+)/.exec(className || '');
            const text = String(children);
            const isBlock = !!match || text.includes('\n');
            const lang = match?.[1];

            if (!isBlock) {
              return (
                <code className="docs-inline-code" {...rest}>
                  {children}
                </code>
              );
            }

            if ((lang === 'jsx' || lang === 'tsx') && isRunnableJsx(text)) {
              return <DemoBlock code={text} lang={lang} />;
            }
            return <CodeBlock code={text} lang={lang || 'text'} />;
          },
          // 外链强制新窗口
          a({ href, children, ...rest }) {
            const isExternal = href?.startsWith('http');
            return (
              <a
                href={href}
                target={isExternal ? '_blank' : undefined}
                rel={isExternal ? 'noopener noreferrer' : undefined}
                {...rest}
              >
                {children}
              </a>
            );
          },
          table(props) {
            return (
              <div className="docs-table-wrap">
                <table {...props} />
              </div>
            );
          },
        }}
      >
        {expandCodeSrc(content)}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
