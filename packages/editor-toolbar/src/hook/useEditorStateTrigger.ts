import type {Editor} from '@tiptap/core';
import {useEffect, useState} from 'react';

export function useEditorStateTrigger(editor: Editor | null) {
  const [, setTick] = useState(0);

  useEffect(() => {
    if (!editor) return;

    const update = () => setTick(tick => tick + 1);

    editor.on('selectionUpdate', update);
    editor.on('transaction', update);

    return () => {
      editor.off('selectionUpdate', update);
      editor.off('transaction', update);
    };
  }, [editor]);
}
