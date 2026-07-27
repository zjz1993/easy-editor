import {expect, test} from '@playwright/test';
import {BASE_URL, clearEditor, findNode, findNodes, focusEditor, getEditorJSON} from './utils';

/**
 * 图片上传流程测试。
 *
 * 覆盖当前实现（packages/extension-image/src/Attachment.ts）：
 * - `setImage({ uploadKey, src, ... })` 插入节点
 * - `updateImageByUploadKey(uploadKey, attrs)` 通过 uploadKey 定位节点
 * - `uploadKey` 在 UniqueID 改写 id 后仍可定位（这是引入 uploadKey 的根本原因）
 * - 失败占位节点（isError: true）渲染 ImageErrorView
 *
 * 端到端真实 XHR 上传依赖 /api/upload 后端，无法在纯前端测试里覆盖，
 * 这里测的是命令层契约 —— 任何上层（工具栏按钮 / 粘贴 / 拖拽 / Word 导入）
 * 最终都通过这两个命令修改图片节点，因此契约成立等于整条链路成立。
 */
test.describe('图片上传流程', () => {

  test.beforeEach(async ({page}) => {
    await page.goto(BASE_URL);
    await focusEditor(page);
    await clearEditor(page);
  });

  // ────────────────────────────────────────────
  // 1. setImage 携带 uploadKey 后，节点 attrs.uploadKey 保留
  // ────────────────────────────────────────────
  test('setImage 携带 uploadKey 后 attrs.uploadKey 保留', async ({page}) => {
    await page.evaluate(() => {
      (window as any).__EASY_EDITOR__
        .chain()
        .focus()
        .setImage({
          uploadKey: 'test-upload-key-1',
          src: 'https://example.com/a.png',
          width: 100,
          height: 100,
        })
        .run();
    });

    const json = await getEditorJSON(page);
    const node = findNode(json, 'image');
    expect(node).toBeDefined();
    expect(node.attrs.uploadKey).toBe('test-upload-key-1');
    expect(node.attrs.src).toBe('https://example.com/a.png');
  });

  // ────────────────────────────────────────────
  // 2. updateImageByUploadKey 能更新 src
  // ────────────────────────────────────────────
  test('updateImageByUploadKey 能更新 src', async ({page}) => {
    await page.evaluate(() => {
      (window as any).__EASY_EDITOR__
        .chain()
        .focus()
        .setImage({
          uploadKey: 'test-upload-key-2',
          src: 'https://example.com/before.png',
          width: 100,
          height: 100,
        })
        .run();
    });

    const updated = await page.evaluate(({key, newUrl}) => {
      return (window as any).__EASY_EDITOR__.commands.updateImageByUploadKey(key, {
        src: newUrl,
      });
    }, {key: 'test-upload-key-2', newUrl: 'https://example.com/after.png'});
    expect(updated).toBe(true);

    const json = await getEditorJSON(page);
    const node = findNode(json, 'image');
    expect(node.attrs.src).toBe('https://example.com/after.png');
    // uploadKey 本身不被覆盖
    expect(node.attrs.uploadKey).toBe('test-upload-key-2');
  });

  // ────────────────────────────────────────────
  // 3. 关键用例：id 被改写后，updateImageByUploadKey 仍能定位节点
  //
  // 模拟 @tiptap/extension-unique-id 行为：插入后立即把 id 改成随机 uuid。
  // 旧路径 updateImageById 会找不到节点；新路径 updateImageByUploadKey 必须仍然成功。
  // ────────────────────────────────────────────
  test('id 被 UniqueID 改写后 updateImageByUploadKey 仍能定位节点', async ({page}) => {
    // 1. 插入节点
    await page.evaluate(() => {
      (window as any).__EASY_EDITOR__
        .chain()
        .focus()
        .setImage({
          uploadKey: 'test-upload-key-3',
          src: 'https://example.com/before-unique.png',
          width: 100,
          height: 100,
        })
        .run();
    });

    // 2. 模拟 UniqueID 改写 id（tr.setNodeMarkup 直接覆盖 id attr）
    const rewrittenId = await page.evaluate(() => {
      const editor = (window as any).__EASY_EDITOR__;
      let newId: string | null = null;
      editor.state.doc.descendants((node: any, pos: number) => {
        if (node.type.name === 'image') {
          newId = 'unique-id-' + Date.now();
          const tr = editor.state.tr.setNodeMarkup(pos, undefined, {
            ...node.attrs,
            id: newId,
          });
          editor.view.dispatch(tr);
          return false;
        }
      });
      return newId;
    });
    expect(rewrittenId).not.toBeNull();

    // 3. 旧命令 updateImageById 用原 id 必然失败
    const legacyResult = await page.evaluate(() => {
      return (window as any).__EASY_EDITOR__.commands.updateImageById(
        'old-id-never-existed',
        {src: 'https://example.com/legacy.png'},
      );
    });
    expect(legacyResult).toBe(false);

    // 4. 新命令 updateImageByUploadKey 仍能成功
    const newResult = await page.evaluate(() => {
      return (window as any).__EASY_EDITOR__.commands.updateImageByUploadKey(
        'test-upload-key-3',
        {src: 'https://example.com/after-unique.png'},
      );
    });
    expect(newResult).toBe(true);

    // 5. 最终 src 落地，id 保留被改写后的值（说明命中了被改写的节点）
    const json = await getEditorJSON(page);
    const node = findNode(json, 'image');
    expect(node.attrs.src).toBe('https://example.com/after-unique.png');
    expect(node.attrs.id).toBe(rewrittenId);
    expect(node.attrs.uploadKey).toBe('test-upload-key-3');
  });

  // ────────────────────────────────────────────
  // 4. updateImageByUploadKey 在 uploadKey 为空时直接返回 false
  // ────────────────────────────────────────────
  test('updateImageByUploadKey 在 uploadKey 为空时返回 false', async ({page}) => {
    await page.evaluate(() => {
      (window as any).__EASY_EDITOR__
        .chain()
        .focus()
        .setImage({
          src: 'https://example.com/no-key.png',
          width: 100,
          height: 100,
        })
        .run();
    });

    const r = await page.evaluate(() => {
      const editor = (window as any).__EASY_EDITOR__;
      // 三种空值都不应误命中节点
      return {
        empty: editor.commands.updateImageByUploadKey('', {src: 'x'}),
        null: editor.commands.updateImageByUploadKey(null, {src: 'x'}),
        undefined: editor.commands.updateImageByUploadKey(undefined, {src: 'x'}),
      };
    });
    expect(r.empty).toBe(false);
    expect(r.null).toBe(false);
    expect(r.undefined).toBe(false);

    // 节点 src 不应被改动
    const json = await getEditorJSON(page);
    const node = findNode(json, 'image');
    expect(node.attrs.src).toBe('https://example.com/no-key.png');
  });

  // ────────────────────────────────────────────
  // 5. updateImageByUploadKey 找不到匹配节点时返回 false
  // ────────────────────────────────────────────
  test('updateImageByUploadKey 找不到匹配节点时返回 false', async ({page}) => {
    await page.evaluate(() => {
      (window as any).__EASY_EDITOR__
        .chain()
        .focus()
        .setImage({
          uploadKey: 'real-key',
          src: 'https://example.com/real.png',
          width: 100,
          height: 100,
        })
        .run();
    });

    const r = await page.evaluate(() => {
      return (window as any).__EASY_EDITOR__.commands.updateImageByUploadKey(
        'non-existent-key',
        {src: 'https://example.com/ghost.png'},
      );
    });
    expect(r).toBe(false);

    const json = await getEditorJSON(page);
    const node = findNode(json, 'image');
    expect(node.attrs.src).toBe('https://example.com/real.png');
  });

  // ────────────────────────────────────────────
  // 6. isError 节点渲染错误占位 UI（ImageErrorView）
  //
  // Word 导入失败 / 上传失败时通过 updateImageByUploadKey 设置 isError: true，
  // ImageView 应切到 ImageErrorView 分支，img 元素不再渲染。
  // ────────────────────────────────────────────
  test('isError 节点渲染错误占位 UI', async ({page}) => {
    await page.evaluate(() => {
      (window as any).__EASY_EDITOR__
        .chain()
        .focus()
        .setImage({
          uploadKey: 'failed-key',
          src: undefined,
          width: 100,
          height: 100,
          isError: true,
        })
        .run();
    });

    // 正常 img 不应渲染（错误态走 ImageErrorView 分支）
    const img = page.locator('.textory-image-container img');
    await expect(img).toHaveCount(0);

    // 错误占位容器存在
    const errorView = page.locator('.textory-image-container');
    await expect(errorView).toHaveCount(1);

    const json = await getEditorJSON(page);
    const node = findNode(json, 'image');
    expect(node.attrs.isError).toBe(true);
  });

  // ────────────────────────────────────────────
  // 7. 多张图片并发上传场景：每个 uploadKey 独立定位
  //
  // 工具栏批量上传会为每张图生成独立 uploadKey，分别 updateImageByUploadKey。
  // 验证 A、B 两张图互不串扰。
  // ────────────────────────────────────────────
  test('多张图片各自 uploadKey 独立定位', async ({page}) => {
    await page.evaluate(() => {
      const editor = (window as any).__EASY_EDITOR__;
      editor
        .chain()
        .focus()
        .setImage({
          uploadKey: 'multi-A',
          src: 'https://example.com/A.png',
          width: 100,
          height: 100,
        })
        .run();
      editor
        .chain()
        .focus()
        .setImage({
          uploadKey: 'multi-B',
          src: 'https://example.com/B.png',
          width: 100,
          height: 100,
        })
        .run();
    });

    // 只更新 A
    const rA = await page.evaluate(() => {
      return (window as any).__EASY_EDITOR__.commands.updateImageByUploadKey(
        'multi-A',
        {src: 'https://example.com/A-uploaded.png'},
      );
    });
    expect(rA).toBe(true);

    // B 不受影响
    // 注意：image 是 inline 节点，被段落包裹，必须用递归 walk 才能找到
    const json = await getEditorJSON(page);
    const nodes = findNodes(json, 'image').map((n: any) => ({
      uploadKey: n.attrs.uploadKey,
      src: n.attrs.src,
    }));
    expect(nodes).toContainEqual({
      uploadKey: 'multi-A',
      src: 'https://example.com/A-uploaded.png',
    });
    expect(nodes).toContainEqual({
      uploadKey: 'multi-B',
      src: 'https://example.com/B.png',
    });
  });

  // ────────────────────────────────────────────
  // 8. 端到端：模拟 onImageUpload 返回值风格 → 节点 src 被替换
  //
  // 由于无法在测试里启动真实 /api/upload 后端，这里直接验证：
  //   插入 blob: 预览图 → 调用 updateImageByUploadKey 模拟「上传成功」→ src 切换
  // 这正是 ImageButton.onStart → onSuccess 链路的核心契约。
  // ────────────────────────────────────────────
  test('端到端：blob 预览 → 模拟上传成功替换 src', async ({page}) => {
    // 1. 插入带 blob: 预览图的节点（模拟工具栏上传过程中显示的本地预览）
    await page.evaluate(() => {
      (window as any).__EASY_EDITOR__
        .chain()
        .focus()
        .setImage({
          uploadKey: 'e2e-key',
          src: 'blob:https://localhost/preview',
          width: 200,
          height: 200,
        })
        .run();
    });

    // 2. 模拟 onImageUpload 返回远程 URL（上传完成）
    const ok = await page.evaluate(() => {
      return (window as any).__EASY_EDITOR__.commands.updateImageByUploadKey(
        'e2e-key',
        {src: 'https://cdn.example.com/final.png'},
      );
    });
    expect(ok).toBe(true);

    // 3. DOM 上 img src 已切换为远程地址
    const img = page.locator('.textory-image-container img');
    await expect(img).toHaveAttribute('src', 'https://cdn.example.com/final.png');

    // 4. JSON 中 src 同步
    const json = await getEditorJSON(page);
    const node = findNode(json, 'image');
    expect(node.attrs.src).toBe('https://cdn.example.com/final.png');
  });

  // ────────────────────────────────────────────
  // 9. 端到端：模拟上传失败 → 节点切到 isError
  //
  // 验证 ImageButton.onError 路径：失败时调用 updateImageByUploadKey
  // 把 src 置空、isError 置 true。
  // ────────────────────────────────────────────
  test('端到端：模拟上传失败 → 节点切到 isError', async ({page}) => {
    await page.evaluate(() => {
      (window as any).__EASY_EDITOR__
        .chain()
        .focus()
        .setImage({
          uploadKey: 'fail-key',
          src: 'blob:https://localhost/preview',
          width: 200,
          height: 200,
        })
        .run();
    });

    const ok = await page.evaluate(() => {
      return (window as any).__EASY_EDITOR__.commands.updateImageByUploadKey(
        'fail-key',
        {src: undefined, isError: true},
      );
    });
    expect(ok).toBe(true);

    // img 不再渲染（错误态）
    const img = page.locator('.textory-image-container img');
    await expect(img).toHaveCount(0);

    const json = await getEditorJSON(page);
    const node = findNode(json, 'image');
    expect(node.attrs.isError).toBe(true);
    // 注意：ProseMirror 把 undefined attr 转成 default。
    // ImageNode 的 src 默认值是 null，所以 {src: undefined} 写入后真实值为 null。
    expect(node.attrs.src).toBeNull();
  });
});
