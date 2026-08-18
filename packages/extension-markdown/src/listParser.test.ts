import {describe, expect, it} from 'vitest';
import StarterKit from '@tiptap/starter-kit';
import {MarkdownManager} from '@tiptap/markdown';
import type {JSONContent, MarkdownParseHelpers, MarkdownToken} from '@tiptap/core';
import {
  MarkdownListHandler,
  buildListItemContent,
  isTaskListItem,
  parseListToken,
  splitListRuns,
} from './listParser';
import {mapParsedMarkdown} from './mapParsedMarkdown';

/** 真实 manager（StarterKit 官方处理器 + 我们的 list handler） */
function createManager(): MarkdownManager {
  return new MarkdownManager({
    extensions: [StarterKit, MarkdownListHandler],
  });
}

function parse(md: string): JSONContent[] {
  const manager = createManager();
  const doc = manager.parse(md);
  const mapped = mapParsedMarkdown(doc);
  return (mapped?.content ?? []) as JSONContent[];
}

describe('isTaskListItem', () => {
  it('识别 marked 的 task 标记与 raw 正则两种形态', () => {
    expect(isTaskListItem({task: true, checked: false} as MarkdownToken)).toBe(true);
    expect(isTaskListItem({raw: '- [x] done'} as MarkdownToken)).toBe(true);
    expect(isTaskListItem({raw: '- plain'} as MarkdownToken)).toBe(false);
    expect(isTaskListItem({raw: '  - [ ] indented'} as MarkdownToken)).toBe(true);
  });
});

describe('splitListRuns', () => {
  it('按任务/非任务切连续段', () => {
    const items = [
      {task: true},
      {task: true},
      {raw: '- b'},
      {task: true},
    ] as unknown as MarkdownToken[];
    expect(splitListRuns(items)).toEqual([
      {isTask: true, items: [items[0], items[1]]},
      {isTask: false, items: [items[2]]},
      {isTask: true, items: [items[3]]},
    ]);
  });
});

describe('parseListToken（stub helpers）', () => {
  const h: MarkdownParseHelpers = {
    parseInline: tokens => tokens.map(t => ({type: 'text', text: String(t.raw ?? '')})),
    parseChildren: tokens => tokens.map(t => ({type: 'paragraph'})),
    parseBlockChildren: tokens => tokens.map(t => ({type: 'paragraph'})),
    createTextNode: (text: string) => ({type: 'text', text}),
    createNode: (type: string, attrs?: any, content?: JSONContent[]) => {
      const node: JSONContent = {type, content};
      if (attrs && Object.keys(attrs).length > 0) {
        node.attrs = attrs;
      }
      return node;
    },
    applyMark: (markType: string, content: JSONContent[]) => ({mark: markType, content}) as any,
  };

  it('有序 / 纯无序列表返回空数组（交还官方处理器）', () => {
    expect(parseListToken({type: 'list', ordered: true, items: []} as MarkdownToken, h)).toEqual([]);
    expect(
      parseListToken({type: 'list', items: [{raw: '- a'}, {raw: '- b'}]} as MarkdownToken, h),
    ).toEqual([]);
  });

  it('非 list token 返回空数组', () => {
    expect(parseListToken({type: 'paragraph'} as MarkdownToken, h)).toEqual([]);
  });

  it('纯任务列表 → checkList/checkListItem', () => {
    const result = parseListToken(
      {
        type: 'list',
        items: [
          {task: true, checked: false, tokens: [{type: 'text', tokens: [{raw: 'todo'}]}]},
          {task: true, checked: true, tokens: [{type: 'text', tokens: [{raw: 'done'}]}]},
        ],
      } as unknown as MarkdownToken,
      h,
    );
    expect(result).toEqual([
      {
        type: 'checkList',
        content: [
          {
            type: 'checkListItem',
            attrs: {checked: false},
            content: [
              {type: 'paragraph', content: [{type: 'text', text: 'todo'}]},
            ],
          },
          {
            type: 'checkListItem',
            attrs: {checked: true},
            content: [
              {type: 'paragraph', content: [{type: 'text', text: 'done'}]},
            ],
          },
        ],
      },
    ]);
  });

  it('空 tokens 的任务项补空 paragraph（schema 要求）', () => {
    const result = parseListToken(
      {type: 'list', items: [{task: true, checked: false}]} as unknown as MarkdownToken,
      h,
    );
    expect(result[0]?.content?.[0]?.content?.[0]?.type).toBe('paragraph');
  });
});

describe('buildListItemContent', () => {
  const h: MarkdownParseHelpers = {
    parseInline: () => [],
    parseChildren: tokens => tokens.map(() => ({type: 'paragraph'})),
    createTextNode: (text: string) => ({type: 'text', text}),
    createNode: (type: string, _attrs?: any, content?: JSONContent[]) => ({type, content: content ?? []}),
    applyMark: (markType: string, content: JSONContent[]) => ({mark: markType, content}) as any,
  };

  it('text 字段兜底为 paragraph', () => {
    const content = buildListItemContent({type: 'list_item', text: 'hello'} as MarkdownToken, h);
    expect(content).toEqual([
      {type: 'paragraph', content: [{type: 'text', text: 'hello'}]},
    ]);
  });

  it('nestedTokens 追加为块级子节点', () => {
    const content = buildListItemContent(
      {
        type: 'list_item',
        tokens: [{type: 'text', tokens: [{raw: 'a'}]}],
        nestedTokens: [{type: 'list'}],
      } as unknown as MarkdownToken,
      h,
    );
    // paragraph + nestedTokens 解析出的节点
    expect(content[0]?.type).toBe('paragraph');
    expect(content).toHaveLength(2);
  });
});

describe('MarkdownManager 集成（真实解析管线）', () => {
  it('纯任务列表：勾选语义完整保留', () => {
    const nodes = parse('- [ ] todo\n- [x] done');
    expect(nodes).toHaveLength(1);
    expect(nodes[0]?.type).toBe('checkList');
    const [first, second] = nodes[0]?.content ?? [];
    expect(first?.type).toBe('checkListItem');
    expect(first?.attrs).toEqual({checked: false});
    expect(first?.content?.[0]?.type).toBe('paragraph');
    expect(second?.attrs).toEqual({checked: true});
  });

  it('纯无序列表：官方兜底 + 改名为 unorderedList/list_item', () => {
    const nodes = parse('- a\n- b');
    expect(nodes[0]?.type).toBe('unorderedList');
    expect(nodes[0]?.content?.[0]?.type).toBe('list_item');
    const texts = nodes[0]?.content?.map(item => item.content?.[0]?.content?.[0]?.text);
    expect(texts).toEqual(['a', 'b']);
  });

  it('混合任务/无序：按连续段切分为 checkList + unorderedList', () => {
    const nodes = parse('- [ ] t1\n- b1\n- b2');
    expect(nodes.map(n => n.type)).toEqual(['checkList', 'unorderedList']);
    expect(nodes[1]?.content?.map(i => i.content?.[0]?.content?.[0]?.text)).toEqual(['b1', 'b2']);
  });

  it('有序列表：orderedList + 改名后的 list_item', () => {
    const nodes = parse('1. one\n2. two');
    expect(nodes[0]?.type).toBe('orderedList');
    expect(nodes[0]?.content?.[0]?.type).toBe('list_item');
  });

  it('嵌套无序列表', () => {
    const nodes = parse('- a\n  - a1\n  - a2\n- b');
    const outer = nodes[0];
    expect(outer?.type).toBe('unorderedList');
    const firstItem = outer?.content?.[0];
    const nested = firstItem?.content?.find(n => n.type === 'unorderedList');
    expect(nested?.content).toHaveLength(2);
    expect(nested?.content?.[0]?.type).toBe('list_item');
  });

  it('任务列表带嵌套内容', () => {
    const nodes = parse('- [ ] parent\n  - [ ] child');
    const parent = nodes[0]?.content?.[0];
    const nested = parent?.content?.find(n => n.type === 'checkList');
    expect(nested?.content?.[0]?.type).toBe('checkListItem');
    expect(nested?.content?.[0]?.attrs).toEqual({checked: false});
  });

  it('标题/加粗/行内代码等默认路径不受影响', () => {
    const nodes = parse('# Title\n\nsome **bold** and `code`');
    expect(nodes[0]?.type).toBe('heading');
    expect(nodes[0]?.attrs?.level).toBe(1);
    const para = nodes[1];
    const texts = para?.content ?? [];
    expect(texts.some(t => t.marks?.some(m => m.type === 'bold'))).toBe(true);
    expect(texts.some(t => t.marks?.some(m => m.type === 'code'))).toBe(true);
  });
});
