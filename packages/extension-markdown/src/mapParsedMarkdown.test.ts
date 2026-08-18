import {describe, expect, it} from 'vitest';
import {mapParsedMarkdown, isSafeUrl} from './mapParsedMarkdown';

describe('mapParsedMarkdown', () => {
  it('节点改名：horizontalRule → divider', () => {
    const result = mapParsedMarkdown({
      type: 'doc',
      content: [{type: 'paragraph', content: [{type: 'text', text: 'a'}]}, {type: 'horizontalRule'}],
    });
    expect(result?.content?.[1]?.type).toBe('divider');
  });

  it('节点改名：bulletList/listItem → unorderedList/list_item', () => {
    const result = mapParsedMarkdown({
      type: 'doc',
      content: [
        {
          type: 'bulletList',
          content: [
            {type: 'listItem', content: [{type: 'paragraph', content: [{type: 'text', text: 'x'}]}]},
          ],
        },
      ],
    });
    expect(result?.content?.[0]?.type).toBe('unorderedList');
    expect(result?.content?.[0]?.content?.[0]?.type).toBe('list_item');
  });

  it('节点改名：taskList/taskItem → checkList/checkListItem', () => {
    const result = mapParsedMarkdown({
      type: 'doc',
      content: [
        {
          type: 'taskList',
          content: [{type: 'taskItem', attrs: {checked: true}, content: []}],
        },
      ],
    });
    expect(result?.content?.[0]?.type).toBe('checkList');
    expect(result?.content?.[0]?.content?.[0]?.type).toBe('checkListItem');
    expect(result?.content?.[0]?.content?.[0]?.attrs).toEqual({checked: true});
  });

  it('非法 scheme 的链接 mark 被剥离，文本保留', () => {
    const result = mapParsedMarkdown({
      type: 'paragraph',
      content: [
        {type: 'text', text: '点我', marks: [{type: 'link', attrs: {href: 'javascript:alert(1)'}}]},
      ],
    });
    expect(result?.content?.[0]?.marks).toBeUndefined();
    expect(result?.content?.[0]?.text).toBe('点我');
  });

  it('相对路径链接同样剥离（仅允许 http(s)）', () => {
    const result = mapParsedMarkdown({
      type: 'paragraph',
      content: [{type: 'text', text: 'x', marks: [{type: 'link', attrs: {href: './a.md'}}]}],
    });
    expect(result?.content?.[0]?.marks).toBeUndefined();
  });

  it('合法 https 链接 mark 保留', () => {
    const result = mapParsedMarkdown({
      type: 'paragraph',
      content: [
        {type: 'text', text: 'x', marks: [{type: 'link', attrs: {href: 'https://a.com'}}]},
      ],
    });
    expect(result?.content?.[0]?.marks?.[0]?.attrs?.href).toBe('https://a.com');
  });

  it('非法 scheme 的图片节点被丢弃', () => {
    const result = mapParsedMarkdown({
      type: 'doc',
      content: [
        {type: 'paragraph', content: [{type: 'image', attrs: {src: 'javascript:alert(1)'}}]},
      ],
    });
    expect(result?.content).toHaveLength(0);
  });

  it('仅含非法图片的段落整体丢弃，相邻正常段落保留', () => {
    const result = mapParsedMarkdown({
      type: 'doc',
      content: [
        {type: 'paragraph', content: [{type: 'image', attrs: {src: 'data:image/png;base64,x'}}]},
        {type: 'paragraph', content: [{type: 'text', text: 'keep'}]},
      ],
    });
    expect(result?.content).toHaveLength(1);
    expect(result?.content?.[0]?.content?.[0]?.text).toBe('keep');
  });

  it('合法 http 图片保留', () => {
    const result = mapParsedMarkdown({
      type: 'doc',
      content: [{type: 'paragraph', content: [{type: 'image', attrs: {src: 'http://a.com/x.png', alt: 'a'}}]}],
    });
    expect(result?.content?.[0]?.content?.[0]?.type).toBe('image');
  });

  it('嵌套结构递归处理', () => {
    const result = mapParsedMarkdown({
      type: 'doc',
      content: [
        {
          type: 'bulletList',
          content: [
            {
              type: 'listItem',
              content: [
                {type: 'paragraph', content: [{type: 'text', text: 'a'}]},
                {
                  type: 'bulletList',
                  content: [{type: 'listItem', content: [{type: 'paragraph'}]}],
                },
              ],
            },
          ],
        },
      ],
    });
    const outer = result?.content?.[0];
    const inner = outer?.content?.[0]?.content?.[1];
    expect(outer?.type).toBe('unorderedList');
    expect(inner?.type).toBe('unorderedList');
    expect(inner?.content?.[0]?.type).toBe('list_item');
  });
});

describe('isSafeUrl', () => {
  it('仅 http(s) 通过', () => {
    expect(isSafeUrl('https://a.com')).toBe(true);
    expect(isSafeUrl('http://a.com')).toBe(true);
    expect(isSafeUrl('HTTPS://A.COM')).toBe(true);
    expect(isSafeUrl('javascript:alert(1)')).toBe(false);
    expect(isSafeUrl('data:text/html,x')).toBe(false);
    expect(isSafeUrl('/relative/path')).toBe(false);
    expect(isSafeUrl(undefined)).toBe(false);
    expect(isSafeUrl(123)).toBe(false);
  });
});
