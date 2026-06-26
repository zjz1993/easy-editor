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

/**
 * 递归查找 ProseMirror JSON 中所有 type 为 nodeType 的节点
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function findNodes(json: any, nodeType: string): any[] {
  const result: any[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const walk = (node: any) => {
    if (!node) return;
    if (node.type === nodeType) {
      result.push(node);
    }
    if (Array.isArray(node.content)) {
      for (const child of node.content) {
        walk(child);
      }
    }
  };
  walk(json);
  return result;
}

/**
 * 递归查找第一个匹配的节点
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function findNode(json: any, nodeType: string): any | undefined {
  if (!json) return undefined;
  if (json.type === nodeType) return json;
  if (Array.isArray(json.content)) {
    for (const child of json.content) {
      const found = findNode(child, nodeType);
      if (found) return found;
    }
  }
  return undefined;
}

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
