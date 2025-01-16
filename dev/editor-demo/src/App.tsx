import Editor from '@easy-editor/editor'

function App() {

  return (
    <>
      <div style={{ height: '100vh' }}>
        <Editor title="1234"  content="初始内容" onChange={(data) => {
          console.log('输出的内容是', data);
        }}/>
      </div>
    </>
  )
}

export default App
