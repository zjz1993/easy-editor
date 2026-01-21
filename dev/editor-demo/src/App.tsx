import Editor from '@textory/editor';
import '@textory/styles/src/index.scss';
import {useState} from "react";

function App() {
  const [editable, setEditable] = useState(true);
  return (
    <>
      <div style={{ height: '100vh' }}>
        <div>{editable ? '能编辑' : '不能'}</div>
        <button onClick={() => {
          setEditable(!editable);
        }}>测试</button>
        <Editor
          placeholder="这是一个Placeholder"
          title="1234"
          onChange={(data) => {
            console.log('输出的内容是', data);
          }}
          editable={false}
          // editable={editable}
          imageProps={{
            onImageUpload:(option) => {
              console.log('onImageUpload触发了吗', option);
              option.onSuccess?.({ data: 'https://hwobs-sq.fanruan.com/shequ_forum/image/4f39ce3ae8685ecc17ec5c947e8e275f.png' });
            }
          }}
        />
      </div>
    </>
  )
}

export default App
