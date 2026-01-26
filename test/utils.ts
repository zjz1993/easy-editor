import {expect as pwExpect, Locator, Page} from '@playwright/test';

export async function focusEditor(page: Page) {
  await page.click('.ProseMirror');
}

export async function getEditorJSON(page: Page) {
  return page.evaluate(() => {
    // @ts-ignore
    return window.__EASY_EDITOR__.getJSON();
  });
}

export async function getEditorHTML(page: Page) {
  return page.evaluate(() => {
    // @ts-ignore
    return window.__EASY_EDITOR__.getHTML();
  });
}
export const MOD = process.platform === 'darwin'
  ? 'Meta'
  : 'Control';

export const BASE_URL = 'http://localhost:5173';

export async function expectReadonly(editor: Locator) {
  // 1. 记录初始内容
  const before = await editor.innerHTML();

  // 2. 尝试 focus + 输入
  await editor.click();
  await editor.page().keyboard.type('hello');

  // 3. 尝试删除
  await editor.page().keyboard.press('Backspace');

  // 4. 尝试粘贴
  await editor.page().keyboard.insertText('paste');

  const after = await editor.innerHTML();
  pwExpect(after).toBe(before);
}
