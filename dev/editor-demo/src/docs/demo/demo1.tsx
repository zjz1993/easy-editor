import {useRef} from "react";
import Editor from "@textory/editor";
import type {EditorRef} from '@textory/editor';

const Demo1 = () => {
  const ref = useRef<EditorRef>(null);
  return (
    <div>
      <button onClick={() => ref.current?.export()}>导出 Word</button>
      <Editor ref={ref} editable />
    </div>
  );
}
export default Demo1;
