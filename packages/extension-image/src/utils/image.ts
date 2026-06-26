import {attachmentUploadPluginKey} from '../plugin/ImagePlaceholderPlugin.ts';
import type {Editor} from "@tiptap/core";

export const updateUploadProgress = (
  editor: Editor,
  id: string,
  progress: number,
) => {
  const tr = editor.state.tr;

  tr.setMeta(attachmentUploadPluginKey, {
    type: 'progress',

    id,

    progress,
  });

  editor.view.dispatch(tr);
};

export const removeUploadProgress = (editor: Editor, id: string) => {
  const tr = editor.state.tr;

  tr.setMeta(attachmentUploadPluginKey, {
    type: 'remove',
    id,
  });

  editor.view.dispatch(tr);
};
