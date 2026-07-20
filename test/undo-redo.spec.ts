import {expect, test} from '@playwright/test';
import {BASE_URL, clearEditor, focusEditor, getEditorJSON, MOD} from './utils';

test('测试undo和redo能否正常工作', async ({ page }) => {
  await page.goto(BASE_URL);

  // demo 默认带示例内容，先清空到一个已知空白状态
  await clearEditor(page);

  await focusEditor(page);
  await page.keyboard.type('hello');
  // undo
  await page.keyboard.press(`${MOD}+Z`);

  let json = await getEditorJSON(page);
  expect(json.content?.[0]?.content).toBeUndefined();

  // redo
  await page.keyboard.press(`${MOD}+Shift+Z`);

  json = await getEditorJSON(page);
  expect(json.content[0].content[0].text).toBe('hello');
});
