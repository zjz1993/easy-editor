import Editor from '@easy-editor/editor'

function App() {

  return (
    <>
      <div style={{ height: '100vh' }}>
        <Editor
          title="1234"
          onChange={(data) => {
            console.log('输出的内容是', data);
          }}
          imageProps={{
            onImageUpload:(option) => {
              option.onSuccess?.({ data: 'https://pica.zhimg.com/50/v2-11302f948748d0e272a4d8401971ed1d_qhd.jpg?source=b6762063' });
            }
          }}
        />
      </div>
    </>
  )
}

export default App
