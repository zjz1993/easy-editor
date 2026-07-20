import {expect, test} from '@playwright/test';
import {BASE_URL, findNode, findNodes, focusEditor, getEditorJSON} from './utils';

const TEST_IMAGE_URL =
  'https://zhaojunzhe.site/images/test.png';

test('图片功能测试', async ({page}) => {
  await page.goto(BASE_URL);
  await focusEditor(page);

  // ────────────────────────────────────────────
  // 1. 通过 editor 命令插入图片
  // ────────────────────────────────────────────
  await test.step('通过editor命令插入图片', async () => {
    await page.evaluate((url) => {
      (window as any).__EASY_EDITOR__
        .chain()
        .focus()
        .setImage({
          id: 'test-image-1',
          src: url,
          width: 200,
          height: 200,
        })
        .run();
    }, TEST_IMAGE_URL);

    const json = await getEditorJSON(page);
    const imageNode = findNode(json, 'image');
    expect(imageNode).toBeDefined();
    expect(imageNode.attrs.src).toBe(TEST_IMAGE_URL);
    expect(imageNode.attrs.width).toBe(200);
    expect(imageNode.attrs.height).toBe(200);
  });

  // ────────────────────────────────────────────
  // 2. 插入图片后渲染对应的 img 元素
  // ────────────────────────────────────────────
  await test.step('插入图片后渲染对应的img元素', async () => {
    const container = page.locator('.textory-image-container');
    await expect(container).toHaveCount(1);

    const img = container.locator('img');
    await expect(img).toHaveAttribute('src', TEST_IMAGE_URL);
    await expect(img).toHaveAttribute('width', '200');
    await expect(img).toHaveAttribute('height', '200');
  });

  // ────────────────────────────────────────────
  // 3. 选中图片时显示 resize 手柄
  // ────────────────────────────────────────────
  await test.step('选中图片时显示resize手柄', async () => {
    const container = page.locator('.textory-image-container');
    await container.click();
    const resizeHandles = page.locator('.textory-image__resize-handle');
    await expect(resizeHandles).toHaveCount(4);
  });

  // ────────────────────────────────────────────
  // 4. hover 图片时显示对齐工具栏
  // ────────────────────────────────────────────
  await test.step('hover图片时显示对齐工具栏', async () => {
    const img = page.locator('.textory-image-container img');
    await img.hover();
    const toolbar = page.locator('.textory-image-toolbar');
    await expect(toolbar).toBeVisible();
  });

  // ────────────────────────────────────────────
  // 5. 通过命令修改图片对齐方式为居中
  // ────────────────────────────────────────────
  await test.step('通过命令修改图片对齐方式为居中', async () => {
    let json = await getEditorJSON(page);
    const imageNode = findNode(json, 'image');
    expect(imageNode.attrs.textAlign).toBe('left');

    // 先选中图片节点，再调用 updateAttrs
    await page.evaluate(() => {
      const editor = (window as any).__EASY_EDITOR__;
      editor.state.doc.descendants((node: any, pos: number) => {
        if (node.type.name === 'image') {
          editor.chain().setNodeSelection(pos).updateAttrs({textAlign: 'center'}).run();
          return false;
        }
      });
    });

    json = await getEditorJSON(page);
    const updatedNode = findNode(json, 'image');
    expect(updatedNode.attrs.textAlign).toBe('center');

    const container = page.locator('.textory-image-container');
    await expect(container).toHaveClass(/textory-image-center/);
  });

  // ────────────────────────────────────────────
  // 6. 通过命令修改图片边框
  // ────────────────────────────────────────────
  await test.step('通过命令修改图片边框', async () => {
    let json = await getEditorJSON(page);
    let imgNode = findNode(json, 'image');
    expect(imgNode.attrs.hasBorder).toBe(false);

    // 先选中图片节点，再调用 updateAttrs
    await page.evaluate(() => {
      const editor = (window as any).__EASY_EDITOR__;
      editor.state.doc.descendants((node: any, pos: number) => {
        if (node.type.name === 'image') {
          editor.chain().setNodeSelection(pos).updateAttrs({hasBorder: true}).run();
          return false;
        }
      });
    });

    json = await getEditorJSON(page);
    imgNode = findNode(json, 'image');
    expect(imgNode.attrs.hasBorder).toBe(true);

    const imgSpan = page.locator('.textory-image');
    await expect(imgSpan).toHaveClass(/textory-image-border/);
  });

  // ────────────────────────────────────────────
  // 7. 通过命令删除图片
  // ────────────────────────────────────────────
  await test.step('通过命令删除图片', async () => {
    let json = await getEditorJSON(page);
    expect(findNode(json, 'image')).toBeDefined();

    await page.evaluate(() => {
      const editor = (window as any).__EASY_EDITOR__;
      editor.state.doc.descendants((node: any, pos: number) => {
        if (node.type.name === 'image') {
          editor.chain().setNodeSelection(pos).deleteSelection().run();
          return false;
        }
      });
    });

    json = await getEditorJSON(page);
    expect(findNode(json, 'image')).toBeUndefined();
  });

  // ────────────────────────────────────────────
  // 8. (已跳过) 清空编辑器，测试 loading 状态渲染进度圈
  //
  // 原本通过 `setImage({ loadingProgress: 50 })` attr 触发 placeholder，
  // 但当前 Image 扩展把上传进度改成了 `attachmentUploadPluginKey` 上的 plugin
  // state（见 packages/extension-image/src/plugin/ImagePlaceholderPlugin.ts），
  // `loadingProgress` 这个 attr 已不存在。
  // 要恢复测试需要从外部 dispatch 一个 `setMeta(attachmentUploadPluginKey, ...)`
  // 进去，但 PluginKey 实例未对外暴露。如果以后扩展导出了该 key 或者提供
  // `setUploadProgress(id, progress)` 命令，可以补回这个用例。
  // ────────────────────────────────────────────

  // ────────────────────────────────────────────
  // 9. updateImageById 命令能更新指定图片
  //
  // 注意：`UniqueID.configure({ types: 'all' })`（见 editor-main/src/root.tsx）
  // 会给所有节点生成 id，覆盖 setImage 传入的 id。所以测试要先读出实际 id
  // 再用该 id 调 updateImageById。
  // ────────────────────────────────────────────
  await test.step('updateImageById命令能更新指定图片', async () => {
    const imageUrl2 =
      'https://raw.githubusercontent.com/nicepkg/gpt-runner/main/assets/banner.png';

    // 先清空再插入
    await page.evaluate((url) => {
      const editor = (window as any).__EASY_EDITOR__;
      editor.commands.clearContent();
      editor
        .chain()
        .focus()
        .setImage({
          id: 'img-to-update',
          src: url,
          width: 200,
          height: 200,
        })
        .run();
    }, TEST_IMAGE_URL);

    let json = await getEditorJSON(page);
    let imgNode = findNode(json, 'image');
    expect(imgNode.attrs.src).toBe(TEST_IMAGE_URL);

    // 读出 UniqueID 实际生成的 id
    const actualId = imgNode.attrs.id;
    expect(typeof actualId).toBe('string');

    const updated = await page.evaluate(({newUrl, id}) => {
      return (window as any).__EASY_EDITOR__.commands.updateImageById(id, {
        src: newUrl,
      });
    }, {newUrl: imageUrl2, id: actualId});
    expect(updated).toBe(true);

    json = await getEditorJSON(page);
    imgNode = findNode(json, 'image');
    expect(imgNode.attrs.src).toBe(imageUrl2);
    expect(imgNode.attrs.id).toBe(actualId);
  });

  // ────────────────────────────────────────────
  // 10. 插入多张图片后都能正确渲染
  // ────────────────────────────────────────────
  await test.step('插入多张图片后都能正确渲染', async () => {
    await page.evaluate((url) => {
      const editor = (window as any).__EASY_EDITOR__;
      editor.commands.clearContent();
      for (let i = 1; i <= 3; i++) {
        editor
          .chain()
          .focus()
          .setImage({
            id: `multi-img-${i}`,
            src: `${url}?t=${i}`,
            width: 100 + i * 50,
            height: 100,
          })
          .run();
      }
    }, TEST_IMAGE_URL);

    const json = await getEditorJSON(page);
    const imageNodes = findNodes(json, 'image');
    expect(imageNodes).toHaveLength(3);

    const containers = page.locator('.textory-image-container');
    await expect(containers).toHaveCount(3);
  });

  // ────────────────────────────────────────────
  // 11. 编辑器不可编辑时图片不可操作
  // ────────────────────────────────────────────
  await test.step('编辑器不可编辑时图片不可操作', async () => {
    // 先清空并重新插入一张干净的图片
    await page.evaluate((url) => {
      const editor = (window as any).__EASY_EDITOR__;
      editor.commands.clearContent();
      editor
        .chain()
        .focus()
        .setImage({
          id: 'readonly-img',
          src: url,
          width: 200,
          height: 200,
        })
        .run();
    }, TEST_IMAGE_URL);

    // 确认只有一张图片
    const container = page.locator('.textory-image-container');
    await expect(container).toHaveCount(1);

    // 设置为不可编辑
    await page.evaluate(() => {
      (window as any).__EASY_EDITOR__.setEditable(false);
    });

    const editor = page.locator('.ProseMirror');
    await expect(editor).toHaveAttribute('contenteditable', 'false');

    await container.click({force: true});

    const resizeHandles = page.locator('.textory-image__resize-handle');
    await expect(resizeHandles).toHaveCount(0);
  });
});
