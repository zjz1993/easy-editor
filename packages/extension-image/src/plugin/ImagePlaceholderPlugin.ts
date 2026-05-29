import {Plugin, PluginKey} from '@tiptap/pm/state';

export interface UploadState {
  progressMap: Record<string, number>;
}
export const attachmentUploadPluginKey = new PluginKey('ImageUploadPlugin');
export const createUploadPlugin = () => {
  return ImagePlaceholderPlugin;
};
export const ImagePlaceholderPlugin = new Plugin<UploadState>({
  key: attachmentUploadPluginKey,
  state: {
    init() {
      return {
        progressMap: {},
      };
    },

    apply(tr, value) {
      const meta = tr.getMeta(attachmentUploadPluginKey);

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
