import {useEditorContext} from './EditorContext';

export const useEditorProps = () => {
  return useEditorContext().props;
};
