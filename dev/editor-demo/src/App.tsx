import Editor from '@easy-editor/editor';
import '@easy-editor/styles/src/index.scss';

function App() {

  return (
    <>
      <div style={{ height: '100vh' }}>
        <Editor
          placeholder="这是一个Placeholder"
          title="1234"
          onChange={(data) => {
            console.log('输出的内容是', data);
          }}
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
