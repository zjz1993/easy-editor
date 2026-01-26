import {expect, test} from '@playwright/test';
//@ts-ignore
import {BASE_URL, expectReadonly} from "./utils";

test('测试禁止状态下能否输入', async ({page}) => {
  await page.goto(BASE_URL); // editor-demo 地址
  await page.evaluate(() => {
    (window as any).__EASY_EDITOR__.setEditable(false);
  });

  const editor = page.locator('.ProseMirror');
  // 找一个工具栏上的按钮 它应该处于禁止状态
  await page.evaluate(() => {
    (window as any).__EASY_EDITOR__.setEditable(false);
  });
  const boldBtn = page.getByRole("button", {name: 'bold'});

  // 等编辑器本身进入 readonly
  await expect(editor).toHaveAttribute('contenteditable', 'false');
  // 记录初始内容
  const before = await editor.innerHTML();
  const selection = await page.evaluate(() => {
    const sel = window.getSelection();
    return sel?.toString();
  });


  // 即使强制点击
  await boldBtn.click({ force: true });
  const afterSelection = await page.evaluate(() => {
    const sel = window.getSelection();
    return sel?.toString();
  });
  const after = await editor.innerHTML();

  // 内容不应发生变化
  await expect(after).toBe(before);
  await expect(afterSelection).toBe(selection);
  await expectReadonly(editor);
});
