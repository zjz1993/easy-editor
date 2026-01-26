import {expect, test} from '@playwright/test';
import {BASE_URL} from "./utils";

test('测试加粗按钮能否正常工作', async ({ page }) => {
  await page.goto(BASE_URL);

  const editor = page.locator('.ProseMirror');

  await editor.click();
  await page.keyboard.type('hello');
  const boldBtn = page.getByRole("button",{name:'bold'});
  await expect(boldBtn).toBeVisible();
  await boldBtn.click();


  // 再输入
  await page.keyboard.type(' world');

  // 断言 strong 标签
  await expect(editor.locator('strong')).toHaveText(' world');
});
