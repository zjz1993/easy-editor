import {getFilesFromEvent, isImageExt, isVideoExt, parseMIMEType,} from '@textory/editor-utils';
import {filter, get, isEmpty} from 'lodash-es';
import {Plugin, TextSelection} from '@tiptap/pm/state';
import type {EditorView} from '@tiptap/pm/view';

// `imgUploader` / `fileUploader` 是我们扩展注入的自定义 EditorProps key，
// 不在 prosemirror-view 的官方 EditorProps 类型里，用 any 视图绕过类型校验。
type AnyEditorView = Omit<EditorView, 'someProp'> & {
  someProp(propName: string): any;
};

const uploadImage = (
  view: AnyEditorView,
  files: any[],
  coords: { x: any; y: any },
) => {
  const imgUploader = view.someProp('imgUploader') as any;
  const fileUploader = view.someProp('fileUploader') as any;
  const videoUploader = view.someProp('videoUploader') as any;
  if (!isEmpty(files)) {
    if (get(files, [0], {}).type.name === 'table') {
      const { schema } = view.state;
      const tr = view.state.tr.replaceSelectionWith(files[0]);
      // const newTr = updateTableIndices(tr, view.state);
      view.dispatch(tr);
      return true; // 阻止默认粘贴行为
    }
    files = files.map(file => new File([file], file.name, { type: file.type }));
    const images = filter(files, file =>
      isImageExt(parseMIMEType(file.type)[1]),
    );
    const videos = filter(files, file =>
      isVideoExt(parseMIMEType(file.type)[1]),
    );
    // 附件中过滤掉图片和视频两种格式的
    const attachments = filter(
      files,
      file => !images.includes(file) && !videos.includes(file),
    );
    let uploadImageSuccess = false;
    let uploadFileSuccess = false;
    let uploadVideoSuccess = false;

    const upload = (uploader, files) => {
      let { tr } = view.state;
      if (coords) {
        const dropPos = view.posAtCoords({
          left: coords.x,
          top: coords.y,
        });

        if (!dropPos) {
          return false;
        }
        const from = dropPos.pos;
        tr = tr.setSelection(TextSelection.create(tr.doc, from, from));
      } else {
        // const from = tr.selection.to;
        // if (!isNodeSelection(tr.selection)) {
        //   tr = tr.setSelection(TextSelection.create(tr.doc, from, from));
        // }
      }
      setTimeout(() => {
        uploader?.uploader.uploadFiles(files);
      }, 0);
      view.dispatch(tr);
    };

    if (imgUploader?.current) {
      const uploadEnable = !imgUploader.current.props.disabled;
      if (uploadEnable && !isEmpty(images)) {
        upload(imgUploader.current, images);
        uploadImageSuccess = true;
      }
    }
    if (videoUploader?.current) {
      // 安全化：VideoButton 未挂载时（如 features.videoUpload=false）跳过
      const videoEnable = !videoUploader.current.props?.disabled;
      if (videoEnable && !isEmpty(videos)) {
        upload(videoUploader.current, videos);
        uploadVideoSuccess = true;
      }
    }
    if (fileUploader?.current) {
      // 安全化：FileButton 未挂载时（如 features.fileUpload=false）跳过
      const attachmentEnable = !fileUploader.current.props?.disabled;
      if (attachmentEnable && !isEmpty(attachments)) {
        upload(fileUploader.current, attachments);
        uploadFileSuccess = true;
      }
    }

    return uploadImageSuccess || uploadFileSuccess || uploadVideoSuccess;
  }
  return false;
};

const getCoords = e => {
  if (!e) {
    return null;
  }
  if (e.type === 'drop') {
    return { x: e.clientX, y: e.clientY };
  }
  return null;
};

const dropPaste = (view: EditorView, e: any, ignoreCoords?: any) => {
  const files = getFilesFromEvent(e, view);
  const coords = ignoreCoords ? null : getCoords(e);
  if (uploadImage(view as unknown as AnyEditorView, files, coords)) {
    e.preventDefault();
    e.__hasUpload = true;
    return true;
  }
  return false;
};

const uploadPasteAndDropPlugin = () => {
  return new Plugin({
    props: {
      handleDOMEvents: {
        paste(_view, e) {
          return dropPaste(_view, e);
        },
        drop(_view, e) {
          return dropPaste(_view, e);
        },
      },
    },
  });
};

export { dropPaste, getFilesFromEvent };
export default uploadPasteAndDropPlugin;
