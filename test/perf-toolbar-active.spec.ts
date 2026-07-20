import {expect, test} from '@playwright/test';
import {
  BASE_URL,
  getToolbarButtonByIcon,
  isBtnActive,
} from './utils';

/**
 * P0-1 / P0-2 性能改造回归测试
 *
 * 改造内容（详见 `.ai/performance-issues.md`）：
 * - 删除 `useEditorStateTrigger`，Toolbar 不再每个 transaction 全量重渲染
 * - 每个格式按钮（Bold/Italic/Underline/Strike）改成自己用 `useEditorState`
 *   订阅 `editor.isActive('xxx')`，Tiptap 内部 deep compare，只在值变化时重渲染
 *
 * 风险点：
 * - useEditorState selector 写错 → active 状态不更新或更新错位
 *
 * 这组测试不直接断言「重渲染次数」（那需要 React Profiler 接入，太脆），
 * 而是验证 user-visible 行为：active 状态在 toggle 后能正确反映到按钮 class。
 */

test.describe('P0 性能改造：格式按钮 active 状态', () => {
  test.beforeEach(async ({page}) => {
    await page.goto(BASE_URL);
    // 等编辑器就绪
    await page.waitForSelector('.ProseMirror');
  });

  /**
   * Helper：清空编辑器，输入 plain text，并把光标放最后
   */
  async function setupBlankLine(page: import('@playwright/test').Page) {
    await page.evaluate(() => {
      // @ts-ignore
      window.__EASY_EDITOR__?.commands.setContent('<p></p>');
    });
    await page.click('.ProseMirror');
  }

  test('Bold：toggle 后按钮 active 状态切换', async ({page}) => {
    await setupBlankLine(page);
    const boldBtn = getToolbarButtonByIcon(page, 'icon-bold');

    await expect(boldBtn).toBeVisible();
    // 初始：未激活
    expect(await isBtnActive(boldBtn)).toBe(false);

    // 点击启用加粗
    await boldBtn.click();
    expect(await isBtnActive(boldBtn)).toBe(true);

    // 输入后仍应保持激活
    await page.keyboard.type('hello');
    expect(await isBtnActive(boldBtn)).toBe(true);

    // 再次点击关闭
    await boldBtn.click();
    expect(await isBtnActive(boldBtn)).toBe(false);
  });

  test('Italic：toggle 后按钮 active 状态切换', async ({page}) => {
    await setupBlankLine(page);
    const italicBtn = getToolbarButtonByIcon(page, 'icon-italic');

    await expect(italicBtn).toBeVisible();
    expect(await isBtnActive(italicBtn)).toBe(false);

    await italicBtn.click();
    expect(await isBtnActive(italicBtn)).toBe(true);

    await italicBtn.click();
    expect(await isBtnActive(italicBtn)).toBe(false);
  });

  test('Underline：toggle 后按钮 active 状态切换', async ({page}) => {
    await setupBlankLine(page);
    const underlineBtn = getToolbarButtonByIcon(page, 'icon-underline');

    await expect(underlineBtn).toBeVisible();
    expect(await isBtnActive(underlineBtn)).toBe(false);

    await underlineBtn.click();
    expect(await isBtnActive(underlineBtn)).toBe(true);

    await underlineBtn.click();
    expect(await isBtnActive(underlineBtn)).toBe(false);
  });

  test('Strike：toggle 后按钮 active 状态切换', async ({page}) => {
    await setupBlankLine(page);
    const strikeBtn = getToolbarButtonByIcon(page, 'icon-strike');

    await expect(strikeBtn).toBeVisible();
    expect(await isBtnActive(strikeBtn)).toBe(false);

    await strikeBtn.click();
    expect(await isBtnActive(strikeBtn)).toBe(true);

    await strikeBtn.click();
    expect(await isBtnActive(strikeBtn)).toBe(false);
  });

  test('光标移入已加粗文字 → Bold 应自动高亮', async ({page}) => {
    // 准备一段已知 HTML：用 editor API 把光标塞进 strong 内部
    await page.evaluate(() => {
      // @ts-ignore
      const editor = window.__EASY_EDITOR__;
      editor?.commands.setContent(
        '<p>普通文字 <strong>加粗文字</strong> 普通文字</p>',
      );

      // 找到第一个 bold text node 的位置
      let boldPos: number | null = null;
      let plainPos: number | null = null;
      editor.state.doc.descendants((node: any, pos: number) => {
        if (!node.isText) return;
        const hasBold = node.marks.some((m: any) => m.type.name === 'bold');
        if (hasBold && boldPos === null) boldPos = pos;
        if (!hasBold && plainPos === null) plainPos = pos;
      });

      // 光标塞进 bold 文本中间
      editor?.chain().focus().setTextSelection(boldPos + 1).run();
    });

    const boldBtn = getToolbarButtonByIcon(page, 'icon-bold');
    await expect.poll(() => isBtnActive(boldBtn)).toBe(true);

    // 把光标塞进普通文本 → 应取消高亮
    await page.evaluate(() => {
      // @ts-ignore
      const editor = window.__EASY_EDITOR__;
      let plainPos: number | null = null;
      editor.state.doc.descendants((node: any, pos: number) => {
        if (!node.isText) return;
        const hasBold = node.marks.some((m: any) => m.type.name === 'bold');
        if (!hasBold && plainPos === null) plainPos = pos;
      });
      editor?.chain().focus().setTextSelection(plainPos + 1).run();
    });
    await expect.poll(() => isBtnActive(boldBtn)).toBe(false);
  });
});
