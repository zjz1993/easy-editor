import Paragraph from '@tiptap/extension-paragraph';
import {ReactNodeViewRenderer} from '@tiptap/react';
import DragBlockNodeView from './DragBlockNodeView.tsx';

const CustomParagraph = Paragraph.extend({
  draggable: true,
  addNodeView() {
    return ReactNodeViewRenderer(DragBlockNodeView);
  },
});
export default CustomParagraph;
