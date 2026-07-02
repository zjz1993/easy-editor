import Editor, {exportWORD, type EditorRef} from '@textory/editor';
import '@textory/styles/src/index.scss';
import {useRef, useState} from "react";

function App() {
  const [editable] = useState(true);
  const editorRef = useRef<EditorRef>(null);
  return (
    <>
      <div style={{height: '100vh'}}>
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
        }}>测试
        </button>
        <button onClick={() => {
          const editor = (window as any).__EASY_EDITOR__;
          exportWORD({
            data: {
              title: '测试文档',
              content: editor?.getJSON(),
            },
            onExportStarted: () => console.log('开始导出'),
            onExportComplete: () => console.log('导出成功'),
            onExportFailed: () => console.error('导出失败'),
          });
        }}>独立函数导出 DOCX
        </button>
        <button onClick={() => {
          const editor = (window as any).__EASY_EDITOR__;
          exportWORD({
            data: {
              title: '带水印的文档',
              content: editor?.getJSON(),
            },
            watermark: {text: '机密文件', fontSize: 52, color: '848a99'},
          });
        }}>独立函数导出带水印
        </button>
        <button onClick={() => {
          // 通过 ref 调用实例方法，自动使用编辑器当前内容
          editorRef.current?.export({
            data: {title: '通过 ref 导出的文档'},
            watermark: {text: 'ref 水印', fontSize: 36, color: 'FF0000'},
            onExportStarted: () => console.log('ref: 开始导出'),
            onExportComplete: () => console.log('ref: 导出成功'),
            onExportFailed: () => console.error('ref: 导出失败'),
          });
        }}>ref 实例方法导出（带水印）
        </button>
        <Editor
          ref={editorRef}
          placeholder="这是一个Placeholder"
          title="1234"
          outputHTML
          exportProps={{
            watermark:{text:'这是水印', fontSize: 52, color: 'red'},
            onExportStarted: () => {
              console.log('导出开始?')
            },
            onExportComplete: () => {
              console.log('导出结束?')
            },
            onExportFailed: () => {
              console.log('导出失败')
            }
          }}
          onChange={(data) => {
            console.log('输出的内容是', data);
          }}
          editable={editable}
          imageProps={{
            maxFileSize: 600,
            onImageUpload: async (option) => {
              console.log('onImageUpload触发了吗', option);
              const fd = new FormData()
              fd.append('file', option.file)
              // throw new Error('直接报错')
              await fetch("/api/upload", {
                method: "POST",
                body: fd,
              }).then((res) => res.json()).then((res) => {
                option.onSuccess?.({data: res.url});
              }).catch(() => {
              })
            }
          }}
        />
      </div>
    </>
  )
}

export default App
