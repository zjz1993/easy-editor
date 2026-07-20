import {expect, test} from '@playwright/test';
import {
  BASE_URL,
  getToolbarButtonByIcon,
  isDisabled,
} from './utils';

/**
 * P0-1 性能改造回归测试 —— disabled 状态
 *
 * 改造前：toolbar.tsx 在每次 useMemo 重新计算时直接调
 *   `editor.can().chain().focus().xxx().run()`
 *   十几条链式探测，每个 transaction 都重算。
 *
 * 改造后：这些探测全部移入 `useEditorState` 的 selector（caps 对象），
 *   Tiptap deep compare，只在结果变化时重算 menuArray。
 *
 * 风险点：
 * - selector 漏字段 → 按钮永远 disabled 或永远 enabled
 * - selector 字段拼错 → undefined，disabled 判定退化
 *
 * 这组测试验证 caps 派生出的几个关键 disabled 行为仍然正确。
 */

test.describe('P0 性能改造：Toolbar caps 派生的 disabled 状态', () => {
  test.beforeEach(async ({page}) => {
    await page.goto(BASE_URL);
    await page.waitForSelector('.ProseMirror');
  });

  test('Undo / Redo：初始 disabled，输入后 Undo 可用', async ({page}) => {
    // 用空文档开局（demo 默认内容有 history 但 Undo 仍可能 disabled）
    await page.evaluate(() => {
      // @ts-ignore
      window.__EASY_EDITOR__?.commands.setContent('<p></p>');
      // clearHistory 让 redo stack 也清空
      // @ts-ignore
      window.__EASY_EDITOR__?.commands.undo?.();
    });

    const undoBtn = getToolbarButtonByIcon(page, 'icon-undo');
    const redoBtn = getToolbarButtonByIcon(page, 'icon-redo');

    await expect(undoBtn).toBeVisible();

    // 输入新内容 → Undo 应变为可用
    await page.click('.ProseMirror');
    await page.keyboard.type('x');
    // 等一下 React 更新
    await expect.poll(() => isDisabled(undoBtn)).toBe(false);

    // 此时 Redo 仍应 disabled（没有 redo 步）
    expect(await isDisabled(redoBtn)).toBe(true);

    // 点击 Undo 后 Redo 变可用
    await undoBtn.click();
    await expect.poll(() => isDisabled(redoBtn)).toBe(false);
  });

  test('光标在代码块内：所有格式按钮 disabled', async ({page}) => {
    // 准备一个包含代码块的文档
    await page.evaluate(() => {
      // @ts-ignore
      window.__EASY_EDITOR__?.commands.setContent(
        '<pre><code class="language-typescript">const x = 1;</code></pre>',
      );
    });

    const boldBtn = getToolbarButtonByIcon(page, 'icon-bold');
    const italicBtn = getToolbarButtonByIcon(page, 'icon-italic');
    const underlineBtn = getToolbarButtonByIcon(page, 'icon-underline');
    const strikeBtn = getToolbarButtonByIcon(page, 'icon-strike');

    // 点击进入代码块。本仓库 CodeBlock 是 React NodeView，没有 <code> 子元素
    await page.click('.ProseMirror pre');

    // 所有格式按钮应 disabled
    await expect.poll(() => isDisabled(boldBtn)).toBe(true);
    await expect.poll(() => isDisabled(italicBtn)).toBe(true);
    await expect.poll(() => isDisabled(underlineBtn)).toBe(true);
    await expect.poll(() => isDisabled(strikeBtn)).toBe(true);
  });

  test('光标移出代码块：格式按钮恢复可用', async ({page}) => {
    await page.evaluate(() => {
      // @ts-ignore
      window.__EASY_EDITOR__?.commands.setContent(
        '<p>outside</p><pre><code class="language-typescript">const x = 1;</code></pre><p>after</p>',
      );
    });

    const boldBtn = getToolbarButtonByIcon(page, 'icon-bold');

    // 进入代码块 → disabled
    await page.click('.ProseMirror pre');
    await expect.poll(() => isDisabled(boldBtn)).toBe(true);

    // 走出代码块（点击后面的段落）→ 恢复
    await page.click('.ProseMirror p:last-child');
    await expect.poll(() => isDisabled(boldBtn)).toBe(false);
  });

  test('光标在代码块外：格式按钮可用', async ({page}) => {
    await page.evaluate(() => {
      // @ts-ignore
      window.__EASY_EDITOR__?.commands.setContent('<p>hello</p>');
    });

    const boldBtn = getToolbarButtonByIcon(page, 'icon-bold');
    const italicBtn = getToolbarButtonByIcon(page, 'icon-italic');

    await page.click('.ProseMirror p');
    await expect.poll(() => isDisabled(boldBtn)).toBe(false);
    await expect.poll(() => isDisabled(italicBtn)).toBe(false);
  });
});
