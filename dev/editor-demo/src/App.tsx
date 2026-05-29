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
          (window as any).__EASY_EDITOR__
            .chain()
            .focus()
            .setImage({
              id: 'test-image-1',
              src: 'https://zhaojunzhe.site/images/test.png',
              width: 200,
              height: 200,
            })
            .run();
          // setEditable(!editable);
        }}>测试</button>
        <Editor
          placeholder="这是一个Placeholder"
          title="1234"
          onChange={(data) => {
            console.log('输出的内容是', data);
          }}
          editable={editable}
          imageProps={{
            onImageUpload:async (option) => {
              console.log('onImageUpload触发了吗', option);
              const fd = new FormData()
              fd.append('file', option.file)
              // throw new Error('直接报错')
              const res = await fetch("/api/upload",{
                method: "POST",
                body: fd,
              }).then((res) => res.json())
              console.log('上传的res是', res);
              option.onSuccess?.({ data: res.url });
            }
          }}
        />
      </div>
    </>
  )
}

export default App
