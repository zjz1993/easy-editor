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

    const compute = () => editor.storage.characterCount?.characters() ?? 0;

    const update = () => {
      const doc = editor.state.doc;
      if (doc === lastDoc) return;
      if (lastDoc === null) {
        lastDoc = doc;
        setCount(compute());
        return;
      }
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        timer = undefined;
        if (editor.isDestroyed) return;
        lastDoc = editor.state.doc;
        setCount(compute());
      }, COUNT_DEBOUNCE_MS);
    };

    // tiptap v3 的 'create' 是 setTimeout(0) 异步 emit：effect 首跑可能早于
    // 扩展 onCreate，此时 storage.characters 还是占位 () => 0，而 create 到达时
    // doc 引用未变会被上面的去重跳过——初始内容将永远显示 0。
    // 因此 create 必须强制重算（storage 函数此时已就绪）。
    const forceUpdate = () => {
      lastDoc = editor.state.doc;
      setCount(compute());
    };

    editor.on('create', forceUpdate);
    editor.on('transaction', update);
    update();
    return () => {
      editor.off('create', forceUpdate);
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
