import {memo, useEffect, useState} from 'react';
import type {Editor as TiptapEditor} from '@tiptap/react';
import {IntlComponent} from '@textory/editor-common';

export interface CharacterCountBarProps {
  editor: TiptapEditor;
  /**
   * 上限（可选）。超出时展示为 "x / max" 并标红。
   */
  maxCount?: number;
}

/**
 * 底部字数统计状态栏。
 *
 * 计数逻辑在 `@textory/extension-character-count` 的 storage 中实现，
 * 这里只订阅 editor 的 update 事件做展示，与编辑渲染路径解耦。
 */
const COUNT_DEBOUNCE_MS = 300;

const CharacterCountBar = memo<CharacterCountBarProps>(({editor, maxCount}) => {
  const [count, setCount] = useState(() => editor.storage.characterCount?.characters() ?? 0);

  useEffect(() => {
    // 计数是 O(全文) 操作：doc 引用未变的事务（纯光标移动）直接跳过，
    // doc 变化也防抖到输入停顿后统一计算，避免大文档逐键计数拖慢打字。
    let lastDoc: unknown = null;
    let timer: number | undefined;

    const update = () => {
      const doc = editor.state.doc;
      if (doc === lastDoc) return;
      if (lastDoc === null) {
        // 首次进入 effect 立即计数（初始 content 不触发 update 事件）
        lastDoc = doc;
        setCount(editor.storage.characterCount?.characters() ?? 0);
        return;
      }
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        timer = undefined;
        if (editor.isDestroyed) return;
        lastDoc = editor.state.doc;
        setCount(editor.storage.characterCount?.characters() ?? 0);
      }, COUNT_DEBOUNCE_MS);
    };

    // create 兜底初始 content；transaction 覆盖 setContent 等不 emit update 的同步路径
    editor.on('create', update);
    editor.on('transaction', update);
    update();
    return () => {
      editor.off('create', update);
      editor.off('transaction', update);
      window.clearTimeout(timer);
    };
  }, [editor]);

  const isExceeded = maxCount !== undefined && count > maxCount;

  return (
    <div className="textory-character-count" data-exceeded={isExceeded || undefined}>
      {maxCount !== undefined
        ? (IntlComponent.get('characterCount.limit') || '{count} / {max} 字')
            .replace('{count}', String(count))
            .replace('{max}', String(maxCount))
        : (IntlComponent.get('characterCount.characters') || '{count} 字').replace(
            '{count}',
            String(count),
          )}
    </div>
  );
});
CharacterCountBar.displayName = 'CharacterCountBar';

export default CharacterCountBar;
