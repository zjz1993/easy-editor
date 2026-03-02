import Editor from '@textory/editor';
import '@textory/styles/src/index.scss';
import {useState} from "react";

function delay(delayTime: number = 2) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('resolved');
    }, delayTime * 1000);
  });
}

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
          editable={editable}
          imageProps={{
            onImageUpload:async (option) => {
              console.log('onImageUpload触发了吗', option);
              await delay();
              option.onSuccess?.({ data: 'https://obs.cn-east-2.myhuaweicloud.com/shequ-oss/content/case/pic/c92b634185494418b1ab2fed5a217660image.png' });
            }
          }}
        />
      </div>
    </>
  )
}

export default App
