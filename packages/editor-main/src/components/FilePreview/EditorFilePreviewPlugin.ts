import {closest, PREVIEW_CLS} from '@textory/editor-common';
import {Plugin, PluginKey} from '@tiptap/pm/state';

export const EditorFilePreviewPlugin = ({
  pluginKey,
  editor,
  doFilePreview,
}) => {
  return new Plugin({
    key: typeof pluginKey === 'string' ? new PluginKey(pluginKey) : pluginKey,
    props: {
      handleClick(view, _pos, e) {
        // 图片附件预览
        const $target = e.target;

        if ($target) {
          const $imageFullScreen = closest(
            $target,
            `.${PREVIEW_CLS.FULL_SCREEN}`,
          );
          const $fileEl = closest($target, `.${PREVIEW_CLS.IMAGE}`);
          if (
            ($fileEl && $imageFullScreen) ||
            (!editor.isEditable && $fileEl)
          ) {
            doFilePreview($fileEl);
          }
        }
        return false;
      },
      handleDoubleClick(view, pos, e) {
        // 图片附件预览
        const $target = e.target;
        const $fileEl = closest($target, `.${PREVIEW_CLS.FILE}`);
        if (editor.isEditable && $fileEl) {
          doFilePreview($fileEl);
        }
        return false;
      },
    },
  });
};
