import type {TTextoryEditorProps} from '@textory/context';

export const DEFAULT_PROPS: Partial<TTextoryEditorProps> = {
  placeholder: '请输入',
  editable: true,
  imageProps: {
    max: 0,
    minWidth: 100,
    minHeight: 100,
  },
  titleProps: {
    showTitle: true,
    titlePlaceholder: '请输入标题'
  },
  features: {
    outline: true,
    importWord: true,
  },
}
