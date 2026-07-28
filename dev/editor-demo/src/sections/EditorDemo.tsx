import Editor, { type EditorRef } from '@textory/editor';
import { useState, type FC, MutableRefObject } from 'react';
import { DEMO_HTML } from '../data/demoContent';

interface EditorDemoProps {
  editorRef: MutableRefObject<EditorRef | null>;
}

export function delay(delayTime: number = 2) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('resolved');
    }, delayTime * 1000);
  });
}

const EditorDemo: FC<EditorDemoProps> = ({ editorRef }) => {
  const [outlineEnabled, setOutlineEnabled] = useState(true);
  const features = { outline: outlineEnabled, importWord: true, fileUpload: true };
  return (
    <section className="intro-section" id="demo">
      <div className="intro-section__head">
        <span className="intro-section__tagline">LIVE DEMO</span>
        <h2 className="intro-section__title">所见即所得，开箱即用</h2>
        <p className="intro-section__desc">
          直接在下方编辑器中尝试各类格式：标题、列表、表格、代码块、任务清单等，工具栏一键切换。
        </p>
      </div>
      <div className="intro-demo">
        <div className="intro-demo__bar">
          <span />
          <span />
          <span />
          <label className="intro-demo__toggle">
            <input
              type="checkbox"
              checked={outlineEnabled}
              onChange={(e) => setOutlineEnabled(e.target.checked)}
            />
            Outline 功能
          </label>
        </div>
        <div className="intro-demo__editor">
          <Editor
            /**
             * features 只在 mount 时生效，
             * 切换 outline 时通过 key 强制 remount。
             */
            key={outlineEnabled ? 'with-outline' : 'no-outline'}
            ref={editorRef}
            content={DEMO_HTML}
            placeholder="开始你的创作..."
            title="Textory 示例文档"
            editable
            features={features}
            imageProps={{
              maxFileSize: 5 * 1024 * 1024,
              onImageStartUpload:() => {
                console.log('开始上传')
              },
              onImageEndUpload:() => {
                console.log('结束上传')
              },
              onImageUpload: (option) =>
                new Promise<string>((resolve, reject) => {
                  console.log('onImageUpload触发', option);
                  const fd = new FormData();
                  fd.append('file', option.file);

                  const xhr = new XMLHttpRequest();
                  xhr.open('POST', '/api/upload');

                  // 上传进度 → 图片节点上的内置进度环自动更新
                  xhr.upload.onprogress = (e) => {
                    if (!e.lengthComputable) return;
                    const percent = (e.loaded / e.total) * 100;
                    console.log('percent是', percent);
                    option.onProgress?.({ percent });
                  };

                  xhr.onload = () => {
                    if (xhr.status >= 200 && xhr.status < 300) {
                      try {
                        const url = JSON.parse(xhr.responseText).url;
                        resolve(url);
                      } catch (err) {
                        reject(err as Error);
                      }
                    } else {
                      reject(new Error(`HTTP ${xhr.status}`));
                    }
                  };

                  xhr.onerror = () => reject(new Error('network error'));
                  xhr.send(fd);
                }),
            }}
            fileProps={{
              accept:
                '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.rar,.txt',
              // 50 MB in KB (maxFileSize is KB-based, see checkMaxSize).
              maxFileSize: 50 * 1024,
              onFileStartUpload: () => console.log('开始上传文件'),
              onFileEndUpload: () => console.log('结束上传文件'),
              onFileUpload: option =>
                new Promise<string>((resolve, reject) => {
                  console.log('onFileUpload触发', option);
                  const fd = new FormData();
                  fd.append('file', option.file);

                  const xhr = new XMLHttpRequest();
                  xhr.open('POST', '/api/upload');

                  xhr.upload.onprogress = e => {
                    if (!e.lengthComputable) return;
                    const percent = (e.loaded / e.total) * 100;
                    option.onProgress?.({ percent });
                  };

                  xhr.onload = () => {
                    if (xhr.status >= 200 && xhr.status < 300) {
                      try {
                        const url = JSON.parse(xhr.responseText).url;
                        resolve(url);
                      } catch (err) {
                        reject(err as Error);
                      }
                    } else {
                      reject(new Error(`HTTP ${xhr.status}`));
                    }
                  };

                  xhr.onerror = () => reject(new Error('network error'));
                  xhr.send(fd);
                }),
            }}
            onChange={(data, title) => {
              // 演示 onChange 回调，可在控制台查看输出
              console.log('[demo] content changed', data, title);
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default EditorDemo;
