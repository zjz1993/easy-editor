import type {Editor} from '@tiptap/core';
import {uploadPluginKey} from '../plugin/ProgressPlugin.ts';

export const updateUploadProgress = (
  editor: Editor,
  id: string,
  progress: number,
) => {
  const tr = editor.state.tr;

  tr.setMeta(uploadPluginKey, {
    type: 'progress',

    id,

    progress,
  });

  editor.view.dispatch(tr);
};

export const removeUploadProgress = (editor: Editor, id: string) => {
  const tr = editor.state.tr;

  tr.setMeta(uploadPluginKey, {
    type: 'remove',
    id,
  });

  editor.view.dispatch(tr);
};
