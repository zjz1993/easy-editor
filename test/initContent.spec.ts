import {expect, test} from '@playwright/test';
import {BASE_URL} from "./utils";

//@ts-ignore
test('测试能否设置初始值', async ({ page }) => {
  await page.goto(BASE_URL); // editor-demo 地址

  // 聚焦编辑器
  await page.click('.ProseMirror');
  await page.evaluate(() => {
    (window as any).__EASY_EDITOR__.commands.setContent('initContent');
  });

  // 读取 editor state
  const json = await page.evaluate(() => {
    return (window as any).__EASY_EDITOR__.getJSON();
  });

  expect(json).toMatchObject({
    type: 'doc',
    content: [
      {
        type: 'paragraph',
        content: [{ type: 'text', text: 'initContent' }],
      },
    ],
  });
});
