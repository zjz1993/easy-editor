import {expect, test} from '@playwright/test';
import {BASE_URL} from './utils';

/**
 * P0-2 性能改造回归测试 —— editor 初始化
 *
 * 改造历史：
 * 1. 首版改造给 `useEditor` 同时加了 `immediatelyRender: false` +
 *    `shouldRerenderOnTransaction: false`。
 * 2. `immediatelyRender: false` 会把 editor 创建推迟到 useEffect，首次渲染时
 *    editor 为 null，破坏 `TableBubbleMenu`、`OutlineView` 等假设 editor 非 null
 *    的子组件。详见 `.ai/performance-issues.md` P0-2、`.ai/tiptap-performance-guide.md`
 *    第 3 节「⚠️ immediatelyRender: false 的代价」。
 * 3. 最终方案：只保留 `shouldRerenderOnTransaction: false`，不加 immediatelyRender。
 *
 * 这组测试守护这条边界：
 * - 页面加载后 editor 必须立即可用（非 null）
 * - TableBubbleMenu 不应在加载/选中表格时崩溃
 * - 编辑器内容正常初始化（demo 默认 HTML 含表格、代码块等）
 */

test.describe('P0 性能改造：editor 初始化', () => {
  test('页面加载后 window.__EASY_EDITOR__ 立即可用', async ({page}) => {
    await page.goto(BASE_URL);
    await page.waitForSelector('.ProseMirror');

    const ready = await page.evaluate(() => {
      // @ts-ignore
      return !!window.__EASY_EDITOR__;
    });
    expect(ready).toBe(true);
  });

  test('demo 默认内容包含表格、代码块、列表', async ({page}) => {
    await page.goto(BASE_URL);
    await page.waitForSelector('.ProseMirror');

    // 这些都来自 dev/editor-demo/src/data/demoContent.ts 的 DEMO_HTML
    await expect(page.locator('.ProseMirror h1')).toHaveCount(1);
    await expect(page.locator('.ProseMirror h2')).toHaveCount(4);
    await expect(page.locator('.ProseMirror table')).toHaveCount(1);
    await expect(page.locator('.ProseMirror pre')).toHaveCount(1);
    // 本仓库的 TaskList 实现没有暴露 data-type 属性，所以只能按数量校验：
    // demo 里「核心特性」(普通 ul) + 「任务清单」(task list) 共两个 ul
    await expect(page.locator('.ProseMirror ul')).toHaveCount(2);
    await expect(page.locator('.ProseMirror blockquote')).toHaveCount(1);
  });

  test('点击表格单元格不应抛错（TableBubbleMenu 回归）', async ({page}) => {
    await page.goto(BASE_URL);
    await page.waitForSelector('.ProseMirror');

    // 收集 console error，验证没有 null 引用类报错
    const errors: string[] = [];
    page.on('pageerror', err => errors.push(err.message));
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    // 点击表格第一个单元格
    await page.click('.ProseMirror table td, .ProseMirror table th');

    // 等一下，给 BubbleMenu 一个 flushSync 周期
    await page.waitForTimeout(200);

    // 应该没有 "Cannot read properties of null" 这类报错
    const nullErrors = errors.filter(e =>
      /Cannot read properties of null/i.test(e),
    );
    expect(nullErrors).toEqual([]);
  });

  test('点击代码块不应抛错', async ({page}) => {
    await page.goto(BASE_URL);
    await page.waitForSelector('.ProseMirror');

    const errors: string[] = [];
    page.on('pageerror', err => errors.push(err.message));

    // 本仓库 CodeBlock 是 React NodeView，结构是
    //   <div class="react-renderer node-codeBlock">
    //     <div class="textory-code-block ...">
    //       <pre class="hljs">...</pre>
    // 没有 <code> 子元素，所以直接点 pre
    await page.click('.ProseMirror pre');
    await page.waitForTimeout(200);

    const nullErrors = errors.filter(e =>
      /Cannot read properties of null/i.test(e),
    );
    expect(nullErrors).toEqual([]);
  });

  test('shouldRerenderOnTransaction: false 不影响输入', async ({page}) => {
    // 输入会触发 transaction；改造前每个 transaction 都重渲染整个 EditorContent 子树。
    // 改造后关闭该默认行为，由 useEditorState 接管。验证输入仍能正常落盘。
    await page.goto(BASE_URL);
    await page.waitForSelector('.ProseMirror');

    // 清空并输入
    await page.evaluate(() => {
      // @ts-ignore
      window.__EASY_EDITOR__?.commands.setContent('<p></p>');
    });
    await page.click('.ProseMirror');
    await page.keyboard.type('hello world');

    const json = await page.evaluate(() => {
      // @ts-ignore
      return window.__EASY_EDITOR__.getJSON();
    });

    expect(json.content[0].type).toBe('paragraph');
    expect(json.content[0].content?.[0]?.text).toBe('hello world');
  });
});
