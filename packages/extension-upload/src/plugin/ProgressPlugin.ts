import {Plugin, PluginKey} from '@tiptap/pm/state';

export interface UploadState {
  progressMap: Record<string, number>;
}

/**
 * Plugin key for the upload-progress plugin.
 *
 * Renamed from `attachmentUploadPluginKey` when this code lived in
 * `@textory/extension-image`. The alias below preserves backwards-compatible
 * imports; new code should import `uploadPluginKey` directly.
 */
export const uploadPluginKey = new PluginKey('UploadPlugin');

/** @deprecated use `uploadPluginKey` instead. Kept for backwards compatibility. */
export const attachmentUploadPluginKey = uploadPluginKey;

export const createUploadPlugin = () => {
  return UploadProgressPlugin;
};

export const UploadProgressPlugin = new Plugin<UploadState>({
  key: uploadPluginKey,
  state: {
    init() {
      return {
        progressMap: {},
      };
    },

    apply(tr, value) {
      const meta = tr.getMeta(uploadPluginKey);

      if (!meta) {
        return value;
      }

      switch (meta.type) {
        case 'progress':
          return {
            ...value,

            progressMap: {
              ...value.progressMap,

              [meta.id]: meta.progress,
            },
          };

        case 'remove':
          // biome-ignore lint/correctness/noSwitchDeclarations: <explanation>
          const newMap = {
            ...value.progressMap,
          };

          delete newMap[meta.id];

          return {
            ...value,

            progressMap: newMap,
          };

        default:
          return value;
      }
    },
  },
});
