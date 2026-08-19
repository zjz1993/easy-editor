import {describe, expect, it} from 'vitest';
import {Editor, Extension} from '@tiptap/core';
import {Plugin, PluginKey} from '@tiptap/pm/state';
import StarterKit from '@tiptap/starter-kit';
import {Markdown} from '@tiptap/markdown';
import {MarkdownListHandler} from './listParser';
import {mapParsedMarkdown} from './mapParsedMarkdown';
import {convertMarkdownToContent, MarkdownPaste, isRawSourceHtml, isVscodeMarkdownSource, isVscodeCodeCopy} from './MarkdownPaste';
import {MarkdownManager} from '@tiptap/markdown';

/**
 * 模拟 CodeBlock 的宽粘贴拦截器：任意多行且含代码特征的纯文本
 * 一律创建 codeBlock（复刻 CodeBlock.ts handlePaste 的行为边界），
 * priority 与 CodeBlock 相同（默认 100），且在扩展数组中排在
 * MarkdownPaste 之前——用于验证 priority 排序使 Markdown 转换优先。
 */
const GreedyCodeBlockStub = Extension.create({
  name: 'greedyCodeBlockStub',
  priority: 100,
  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('greedyCodeBlockStub'),
        props: {
          handlePaste: (view, event) => {
            const text = event.clipboardData?.getData('text/plain') ?? '';
            if (!text.includes('\n') || !/\b(import|const|function)\b/.test(text)) {
              return false;
            }
            const {tr, schema} = view.state;
            tr.replaceSelectionWith(
              schema.nodes.codeBlock.create({}, schema.text(text)),
            );
            view.dispatch(tr);
            return true;
          },
        },
      }),
    ];
  },
});

function createEditor(content?: Parameters<Editor['options']>[0]['content']) {
  return new Editor({
    extensions: [StarterKit, Markdown, MarkdownListHandler, MarkdownPaste],
    content,
  });
}

function pasteEvent(data: Record<string, string>): ClipboardEvent {
  const dt = new DataTransfer();
  Object.entries(data).forEach(([type, value]) => dt.setData(type, value));
  return new ClipboardEvent('paste', {clipboardData: dt});
}

/**
 * 依序执行所有插件的 handlePaste（模拟 ProseMirror 的 someProp 行为），
 * 返回是否有插件接管了粘贴。
 */
function runPaste(editor: Editor, data: Record<string, string>): boolean {
  const event = pasteEvent(data);
  for (const plugin of editor.state.plugins) {
    const handler = (plugin as any).props?.handlePaste;
    if (typeof handler === 'function' && handler.call(plugin, editor.view, event)) {
      return true;
    }
  }
  return false;
}

/** 依序执行所有插件的 handleTextInput，模拟真实键入 */
function typeText(editor: Editor, text: string): boolean {
  const pos = editor.state.selection.from;
  for (const plugin of editor.state.plugins) {
    const handler = (plugin as any).props?.handleTextInput;
    if (typeof handler === 'function' && handler.call(plugin, editor.view, pos, pos, text)) {
      return true;
    }
  }
  return false;
}

describe('convertMarkdownToContent', () => {
  const manager = new MarkdownManager({
    extensions: [StarterKit, MarkdownListHandler],
  });

  it('无 manager / 空文本 / 非 markdown 返回 null', () => {
    expect(convertMarkdownToContent(undefined, '# x')).toBeNull();
    expect(convertMarkdownToContent(manager, '')).toBeNull();
    expect(convertMarkdownToContent(manager, 'plain text only')).toBeNull();
  });

  it('超长文本短路', () => {
    expect(convertMarkdownToContent(manager, '# ' + 'a'.repeat(10), 5)).toBeNull();
  });

  it('命中特征时产出映射后的节点数组', () => {
    const content = convertMarkdownToContent(manager, '# Title\n\n**bold**');
    expect(content?.[0]?.type).toBe('heading');
    expect(content?.[0]?.attrs?.level).toBe(1);
    expect(content?.[1]?.content?.[0]?.marks?.[0]?.type).toBe('bold');
  });

  it('非法链接被剥离', () => {
    const content = convertMarkdownToContent(
      manager,
      '[点我](javascript:alert(1))',
    );
    expect(content?.[0]?.content?.[0]?.marks).toBeUndefined();
    expect(content?.[0]?.content?.[0]?.text).toBe('点我');
  });
});

describe('isRawSourceHtml', () => {
  it('pre-only 包装识别为裸原文', () => {
    expect(isRawSourceHtml('<pre># a\n- b</pre>')).toBe(true);
    expect(isRawSourceHtml('<html><body><pre>x</pre></body></html>')).toBe(true);
    // VSCode 常见的内联样式噪音
    expect(
      isRawSourceHtml('<style>.a{color:red}</style><pre><span>x</span></pre>'),
    ).toBe(true);
  });

  it('JetBrains IDE 复制格式（html/head/meta 包装）识别为裸原文', () => {
    // 用户实测格式：meta 声明 + pre 主体
    expect(
      isRawSourceHtml(
        '<html><head><meta http-equiv="content-type" content="text/html; charset=UTF-8"></head><body><pre style="margin-top:0"><span style="color:#000080"># </span>标题</pre></body></html>',
      ),
    ).toBe(true);
    // 部分版本 head 里带文件 title（文本内容需剥离，否则误判富文本）
    expect(
      isRawSourceHtml(
        '<html><head><meta http-equiv="content-type" content="text/html; charset=UTF-8"><title>notes.md — IDE</title></head><body><pre># 标题</pre></body></html>',
      ),
    ).toBe(true);
    // 用户真实载荷：div 深色主题包装 + 末尾 NUL 字符（trim 不视其为空白，
    // 未剔除会导致误判为富文本 → 让位 → <pre> 被默认粘贴落成代码块）
    expect(
      isRawSourceHtml(
        '<html><head><meta http-equiv="content-type" content="text/html; charset=UTF-8"></head><body><div style="background-color:#1e1f22;color:#bcbec4"><pre style="font-family:\'Source Code Pro\',monospace;font-size:15.8pt;"><span style="color:#597cc2"># </span>标题<br><br>正文</pre></div></body></html>\u0000',
      ),
    ).toBe(true);
  });

  it('含富文本块级结构时不识别', () => {
    expect(isRawSourceHtml('<h1>标题</h1><p>正文</p>')).toBe(false);
    expect(isRawSourceHtml('<ul><li>a</li></ul>')).toBe(false);
    expect(isRawSourceHtml('<pre>code</pre><p>补充说明</p>')).toBe(false);
    expect(isRawSourceHtml('')).toBe(false);
  });
});

describe('isVscodeMarkdownSource', () => {
  it('仅 markdown/md 文件为 true', () => {
    expect(isVscodeMarkdownSource('{"mode":"markdown"}')).toBe(true);
    expect(isVscodeMarkdownSource('{"mode":"md"}')).toBe(true);
    expect(isVscodeMarkdownSource('{"mode":"Markdown"}')).toBe(true);
    expect(isVscodeMarkdownSource('{"mode":"typescript"}')).toBe(false);
    expect(isVscodeMarkdownSource('not json')).toBe(false);
  });
});

describe('isVscodeCodeCopy', () => {
  it('仅明确的非 markdown 语言视为代码复制', () => {
    expect(isVscodeCodeCopy('{"mode":"typescript"}')).toBe(true);
    expect(isVscodeCodeCopy('{"mode":"markdown"}')).toBe(false);
    // mode 缺失（部分 IDE 分支不写）不作为代码复制信号
    expect(isVscodeCodeCopy('{"copied":true}')).toBe(false);
    expect(isVscodeCodeCopy('not json')).toBe(false);
  });
});

describe('MarkdownPaste（真实 Editor 粘贴）', () => {
  it('粘贴 markdown 纯文本转换为富文本节点', () => {
    const editor = createEditor('<p>base</p>');
    editor.commands.focus('end');
    const handled = runPaste(editor, {'text/plain': '# Hello\n\nsome **bold**'});
    expect(handled).toBe(true);
    const json = editor.getJSON();
    const types = (json.content ?? []).map(n => n.type);
    expect(types).toContain('heading');
    const para = (json.content ?? []).find(
      n => n.type === 'paragraph' && n.content?.some(t => t.text === 'bold'),
    );
    expect(para?.content?.some(t => t.marks?.some(m => m.type === 'bold'))).toBe(true);
    editor.destroy();
  });

  it('粘贴普通纯文本不被接管', () => {
    const editor = createEditor('<p></p>');
    const handled = runPaste(editor, {'text/plain': 'just plain words'});
    expect(handled).toBe(false);
    const json = editor.getJSON();
    expect(json.content?.[0]?.type).toBe('paragraph');
    expect(json.content?.[0]?.content).toBeUndefined();
    editor.destroy();
  });

  it('剪贴板带 text/html 时不接管（走默认 HTML 路径）', () => {
    const editor = createEditor('<p></p>');
    const handled = runPaste(editor, {
      'text/html': '<h2>From HTML</h2>',
      'text/plain': '# From Markdown',
    });
    expect(handled).toBe(false);
    editor.destroy();
  });

  it('html 只是 markdown 原文的 pre 裸包装时仍按 markdown 解析', () => {
    // 复现用户场景：从聊天窗口代码块/IDE 复制，html flavor 为 <pre> 包装的
    // markdown 原文——若让位给默认 HTML 粘贴会被 parseHTML 变成 plaintext
    // 代码块（见 .ai/specs/2026-08-18-markdown-paste-input/spec.md §4）
    const editor = createEditor('<p></p>');
    editor.commands.focus('end');
    const handled = runPaste(editor, {
      'text/html':
        '<html><body><pre style="font-family:monospace"># 标题\n\n**加粗** 和 `代码`\n\n&gt; 引用</pre></body></html>',
      'text/plain': '# 标题\n\n**加粗** 和 `代码`\n\n> 引用',
    });
    expect(handled).toBe(true);
    const types = (editor.getJSON().content ?? []).map(n => n.type);
    expect(types).toContain('heading');
    expect(types).not.toContain('codeBlock');
    editor.destroy();
  });

  it('代码块内粘贴不被接管，保持纯文本', () => {
    const editor = createEditor('<pre><code class="language-js">let a = 1;</code></pre>');
    editor.commands.setTextSelection(3);
    const handled = runPaste(editor, {'text/plain': '# not a heading\n- not a list'});
    expect(handled).toBe(false);
    const json = editor.getJSON();
    expect(json.content?.[0]?.type).toBe('codeBlock');
    expect(editor.getText()).not.toContain('# not a heading');
    editor.destroy();
  });

  it('任务列表粘贴为 checkList（经 mapParsedMarkdown 改名）', () => {
    // StarterKit schema 无 checkList，这里验证 JSON 管线产物名
    const manager = new MarkdownManager({extensions: [StarterKit, MarkdownListHandler]});
    const parsed = manager.parse('- [ ] todo');
    const mapped = mapParsedMarkdown(parsed);
    expect(mapped?.content?.[0]?.type).toBe('checkList');
    expect(mapped?.content?.[0]?.content?.[0]?.attrs).toEqual({checked: false});
  });

  it('转换插入为单事务：一次 undo 撤销', () => {
    const editor = createEditor('<p>base</p>');
    editor.commands.focus('end');
    const handled = runPaste(editor, {'text/plain': '# Hello\n\n**bold**'});
    expect(handled).toBe(true);
    expect(editor.getJSON().content?.length).toBeGreaterThan(1);
    editor.commands.undo();
    const json = editor.getJSON();
    expect(json.content?.length).toBe(1);
    expect(json.content?.[0]?.content?.[0]?.text).toBe('base');
    editor.destroy();
  });

  it('行内链接输入规则：[text](url) + 空格 → 链接', () => {
    const editor = createEditor('<p></p>');
    editor.commands.insertContent('[foo](https://a.com)');
    expect(typeText(editor, ' ')).toBe(true);
    const para = editor.getJSON().content?.[0];
    const textNode = para?.content?.[0];
    expect(textNode?.text).toBe('foo');
    expect(textNode?.marks?.[0]?.type).toBe('link');
    expect(textNode?.marks?.[0]?.attrs?.href).toBe('https://a.com');
    editor.destroy();
  });

  it('非链接方括号文本不受输入规则影响', () => {
    const editor = createEditor('<p></p>');
    editor.commands.insertContent('[note] something');
    typeText(editor, ' ');
    const textNode = editor.getJSON().content?.[0]?.content?.[0];
    expect(textNode?.marks).toBeUndefined();
    editor.destroy();
  });

  it('VSCode 复制 .md 文件（mode=markdown）按 markdown 解析', () => {
    const editor = createEditor('<p></p>');
    editor.commands.focus('end');
    const handled = runPaste(editor, {
      'text/html': '<pre><span># 标题</span></pre>',
      'text/plain': '# 标题\n\n**加粗**',
      'vscode-editor-data': '{"mode":"markdown","copied":true}',
    });
    expect(handled).toBe(true);
    const types = (editor.getJSON().content ?? []).map(n => n.type);
    expect(types).toContain('heading');
    expect(types).not.toContain('codeBlock');
    editor.destroy();
  });

  it('VSCode 复制代码（mode=typescript）让位给 code-block 处理器', () => {
    const editor = createEditor('<p></p>');
    editor.commands.focus('end');
    const handled = runPaste(editor, {
      'text/html': '<span style="color:#ccc">const a = 1;</span>',
      'text/plain': 'const a = 1;\nconst b = 2;',
      'vscode-editor-data': '{"mode":"typescript"}',
    });
    // 本扩展让位；StarterKit 自带的 code-block VSCode 处理器接管为代码块
    expect(handled).toBe(true);
    const json = editor.getJSON();
    expect(json.content?.some(n => n.type === 'codeBlock')).toBe(true);
    editor.destroy();
  });

  it('与宽代码块拦截器共存：Markdown 文本优先转换而非变成代码块', () => {
    // 复现用户反馈的 bug：CodeBlock 的 detectLanguage 会命中含代码特征的
    // Markdown 文本；MarkdownPaste priority=200 必须排在它（100）之前。
    // 样例含 const（触发拦截器条件）但不含列表（StarterKit schema 无
    // unorderedList，列表映射由 listParser.test 单独覆盖）
    const editor = new Editor({
      extensions: [StarterKit, Markdown, MarkdownListHandler, GreedyCodeBlockStub, MarkdownPaste],
      content: '<p></p>',
    });
    editor.commands.focus('end');
    const handled = runPaste(editor, {
      'text/plain': '# 排序回归标题\n\n用 **加粗** 说明 `const` 的用法',
    });
    expect(handled).toBe(true);
    const json = editor.getJSON();
    const types = (json.content ?? []).map(n => n.type);
    expect(types).toContain('heading');
    expect(types).not.toContain('codeBlock');
    const para = (json.content ?? []).find(n => n.type === 'paragraph');
    expect(para?.content?.some(t => t.marks?.some(m => m.type === 'bold'))).toBe(true);
    editor.destroy();
  });

  it('与宽代码块拦截器共存：无 Markdown 特征的纯代码仍走代码块', () => {
    const editor = new Editor({
      extensions: [StarterKit, Markdown, MarkdownListHandler, GreedyCodeBlockStub, MarkdownPaste],
      content: '<p></p>',
    });
    editor.commands.focus('end');
    const handled = runPaste(editor, {
      'text/plain': 'const a = 1;\nfunction run() {\n  return a;\n}',
    });
    expect(handled).toBe(true);
    const json = editor.getJSON();
    expect(json.content?.some(n => n.type === 'codeBlock')).toBe(true);
    editor.destroy();
  });

  it('schema 缺目标节点时不吞粘贴：回退默认路径', () => {
    // StarterKit 没有 unorderedList/list_item；含列表的 markdown 转换产物
    // 无法插入时应返回 false（此前会整包静默丢弃且返回 true）
    const editor = createEditor('<p></p>');
    editor.commands.focus('end');
    const handled = runPaste(editor, {'text/plain': '# 标题\n\n- 列表项'});
    expect(handled).toBe(false);
    editor.destroy();
  });
});
