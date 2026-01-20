import {FilePreview, isEmpty} from '@textory/editor-common';
import type {FC, ReactNode} from 'react';
import {useEffect, useState} from 'react';
import {EditorFilePreviewPlugin} from './EditorFilePreviewPlugin';
import UnSupportFilePreview from './UnSupportImagePreview';
import {collectImagePreviewFiles, getFileIndex} from './utils';
import collectPreviewFiles from './collectPreviewFiles';
import type {Editor} from '@tiptap/core';
import {PluginKey} from '@tiptap/pm/state';

export interface EditorFilePreviewProps {
  editor: Editor;
  onEnterPreview?: () => void;
  onExitPreview?: () => void;
  rightButtons?: ReactNode;
  renderControlBar?: () => ReactNode;
}

const EditorFilePreview: FC<EditorFilePreviewProps> = ({
  editor,
  onEnterPreview,
  onExitPreview,
  rightButtons,
  renderControlBar,
}) => {
  const [previewFiles, setPreviewFiles] = useState([]);
  const [filePreviewVisible, setFilePreviewVisible] = useState(false);
  const [currentPreviewIndex, setCurrentPreviewIndex] = useState(0);

  const doFilePreview = $fileEl => {
    console.log('doFilePreview触发', $fileEl);
    const imageDom = $fileEl.querySelector('img');
    const editorView = editor.view;
    if (!editorView) {
      return;
    }
    let previewFiles;
    let index = 0;
    // TODO 点击的是图片，暂时用自定义的预览图片的方式替代原来的预览方式
    if (imageDom) {
      previewFiles = collectImagePreviewFiles(editorView.dom);
      const clickSrc = imageDom.getAttribute('src');
      const clickFileKey = $fileEl.dataset.id;
      const clickPreviewUrl = $fileEl.dataset.previewurl;
      const clickDownloadUrl = $fileEl.dataset.downloadurl;
      const clickOriginUrl = $fileEl.dataset.originurl;
      const findIdx = previewFiles.findIndex(
        image =>
          image.fileKey === clickFileKey && image.previewUrl === clickSrc,
      );
      if (findIdx > -1) {
        index = findIdx;
      } else {
        // 兼容没找到时的情况
        previewFiles = [
          {
            id: clickFileKey,
            fileKey: clickFileKey,
            type: 'image/png',
            clickOriginUrl: clickOriginUrl || clickSrc,
            previewUrl: clickPreviewUrl || clickSrc,
            url: clickSrc,
            downloadUrl: clickDownloadUrl || clickSrc,
            index: 0,
          },
        ];
      }
    } else {
      previewFiles = collectPreviewFiles(editorView.dom);
      index = getFileIndex(editorView.dom, $fileEl);
    }
    setPreviewFiles(previewFiles);
    setFilePreviewVisible(true);
    setCurrentPreviewIndex(index);
    onEnterPreview?.();
  };

  useEffect(() => {
    if (!editor) {
      return;
    }
    if (editor.isDestroyed) {
      return;
    }
    const pluginKey = new PluginKey('filePreview');
    const plugin = EditorFilePreviewPlugin({
      pluginKey,
      editor,
      doFilePreview: doFilePreview,
    });

    editor.registerPlugin(plugin);

    return () => {
      editor.unregisterPlugin(pluginKey);
    };
  }, [editor]);

  const exitPreview = () => {
    if (onExitPreview) {
      onExitPreview();
    }
  };
  useEffect(() => {
    if (isEmpty(previewFiles) && editor) {
      exitPreview();
    }
  }, [previewFiles, editor]);

  if (isEmpty(previewFiles)) {
    return null;
  }

  return (
    <FilePreview
      renderControlBar={renderControlBar}
      rightButtons={rightButtons}
      visible={filePreviewVisible}
      files={previewFiles}
      activeIndex={currentPreviewIndex}
      onSwitchFile={activeIndex => {
        setCurrentPreviewIndex(activeIndex);
      }}
      unsupportedFileRender={<UnSupportFilePreview />}
      onClose={() => {
        setFilePreviewVisible(false);
        exitPreview();
      }}
    />
  );
};
export default EditorFilePreview;
