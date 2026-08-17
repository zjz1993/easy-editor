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
const CharacterCountBar = memo<CharacterCountBarProps>(({editor, maxCount}) => {
  const [count, setCount] = useState(() => editor.storage.characterCount?.characters() ?? 0);

  useEffect(() => {
    const update = () => setCount(editor.storage.characterCount?.characters() ?? 0);
    // 初始 content 不触发 update 事件，需要 create 兜底；
    // transaction 覆盖 setContent 等不 emit update 的同步路径
    editor.on('create', update);
    editor.on('transaction', update);
    update();
    return () => {
      editor.off('create', update);
      editor.off('transaction', update);
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
