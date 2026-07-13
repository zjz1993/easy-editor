// Playground 预设示例代码
// 使用 react-live 的 noInline 模式：用户代码作为函数体执行，
// 可以使用多条语句、useState 等 hooks，但末尾必须显式调用 render(<JSX />)。

export interface PlaygroundExample {
  id: string;
  label: string;
  description: string;
  code: string;
}

const BASIC = `// 最小可运行示例
render(
  <Editor
    content="<h1>你好，Textory</h1><p>开始你的创作...</p>"
    placeholder="写点什么"
    editable
    outputHTML
    onChange={(data) => console.log(data)}
  />
);`;

const CONTROLLED = `// 用 useState 控制 content
// 注意：使用 hooks 必须包在函数组件里
function App() {
  const [content, setContent] = useState(
    '<h1>初始内容</h1><p>点下面的按钮切换内容</p>'
  );
  return (
    <div>
      <div style={{ marginBottom: 12, display: 'flex', gap: 8 }}>
        <button
          onClick={() =>
            setContent(
              '<h1 style="color:#0082fc">蓝色标题</h1><p>由 useState 控制</p>'
            )
          }
        >
          切换 A
        </button>
        <button
          onClick={() =>
            setContent(
              '<h2>二级标题</h2><ul><li>列表项 1</li><li>列表项 2</li></ul>'
            )
          }
        >
          切换 B
        </button>
      </div>
      <Editor
        content={content}
        editable
        onChange={(html) => console.log(html)}
      />
    </div>
  );
}

render(<App />);`;

const ONCHANGE = `// 把 onChange 输出的 HTML 显示在编辑器下方
// 使用 hooks 必须包在函数组件里
function App() {
  const [html, setHtml] = useState('');
  return (
    <div>
      <Editor
        content="<p>编辑我，下方会实时显示输出的 HTML</p>"
        editable
        outputHTML
        onChange={(data) => setHtml(data)}
      />
      <pre
        style={{
          marginTop: 16,
          padding: 12,
          background: '#f5f5f5',
          borderRadius: 6,
          fontSize: 12,
          lineHeight: 1.5,
          overflow: 'auto',
          maxHeight: 200,
        }}
      >
        {html || '(尚无输出)'}
      </pre>
    </div>
  );
}

render(<App />);`;

const RICH = `// 直接使用内置示例文档，包含表格、任务清单、代码块等
render(<Editor content={DEMO_HTML} editable outputHTML />);`;

const READONLY = `// 设置 editable={false} 进入只读模式
render(
  <Editor
    content="<h1>只读模式</h1><p>editable 为 false 时，用户无法编辑，仅展示。</p><blockquote><p>适合做内容预览 / 详情页。</p></blockquote>"
    editable={false}
  />
);`;

export const PLAYGROUND_EXAMPLES: PlaygroundExample[] = [
  {
    id: 'basic',
    label: '基础用法',
    description: '最小可运行示例，展示核心 props。',
    code: BASIC,
  },
  {
    id: 'controlled',
    label: '受控内容',
    description: '使用 useState 在外部切换编辑器 content。',
    code: CONTROLLED,
  },
  {
    id: 'onchange',
    label: 'onChange 输出',
    description: '实时显示编辑器输出的 HTML。',
    code: ONCHANGE,
  },
  {
    id: 'rich',
    label: '表格 / 任务清单',
    description: '使用内置示例文档，展示富功能。',
    code: RICH,
  },
  {
    id: 'readonly',
    label: '不可编辑模式',
    description: '设置 editable={false} 做只读展示。',
    code: READONLY,
  },
];

export const DEFAULT_EXAMPLE_ID = 'basic';
