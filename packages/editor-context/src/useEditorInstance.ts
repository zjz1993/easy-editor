import {useEditorContext} from './EditorContext';

export const useEditorInstance = () => {
  return useEditorContext().editor;
};
