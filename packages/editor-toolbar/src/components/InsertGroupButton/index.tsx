import {Dropdown, Iconfont, IntlComponent, Upload} from '@textory/editor-common';
import {type FC, useContext, useState} from 'react';
import {useEditorState} from '@tiptap/react';
import cx from 'classnames';
import {v4 as uuid} from 'uuid';
import type {RcFile} from '@textory/context';
import {
  BLOCK_TYPES,
  isInListSelection,
  isInTable,
  isNodeSelection,
  isSelectionInsideBlockByType,
} from '@textory/editor-utils';
import ToolbarItemButtonWrapper from '../ToolbarItemButtonWrapper';
import ToolbarContext from '../../context/toolbarContext.ts';
import type {TToolbarWrapperProps} from '../../types/index.ts';
import TextoryMenu, {type TextoryMenuItem} from '../Menu';
import InsertTablePanel from '../TableButton/insertTablePanel';
import UploadNetworkImageModal from '../ImageButton/UploadNetworkImageModal';
import UploadNetworkVideoModal from '../VideoButton/UploadNetworkVideoModal';
import {removeUploadProgress, updateUploadProgress} from '@textory/extension-upload';
import {
  removeUploadProgress as removeImageProgress,
  updateUploadProgress as updateImageProgress
} from '@textory/extension-image';
import {makeCustomRequest} from '../../utils/makeCustomRequest.ts';

function getImageSizeFromFile(file: File) {
  return new Promise<{ width: number; height: number }>(resolve => {
    const img = new window.Image();
    img.onload = () => {
      resolve({width: img.naturalWidth, height: img.naturalHeight});
    };
    img.src = URL.createObjectURL(file);
  });
}

/**
 * 「插入」分组下拉按钮。
 *
 * 把低频插入类按钮(任务列表/分割线/代码块/表格/图片/视频/附件)收进
 * 一个菜单,缓解工具栏溢出。基于通用 TextoryMenu(rc-menu)实现多级
 * 子菜单:表格 hover 展开选格网格,图片/视频 hover 展开网络/本地上传。
 * 上传回调逻辑与原 ImageButton/VideoButton/FileButton 保持一致。
 *
 * features 门控:videoProps/fileProps 未提供时对应菜单项不渲染
 * (与原一级按钮的门控一致)。
 */
const InsertGroupButton: FC<TToolbarWrapperProps> = props => {
  const {disabled, intlStr, style} = props;
  const {editor, imageProps = {}, fileProps, videoProps} = useContext(ToolbarContext);
  const [menuOpen, setMenuOpen] = useState(false);
  // 子菜单(表格网格/图片视频二级)的展开状态接到外层:
  // 表格选格走 InsertTablePanel 自己的 onClick,不经过 rc-menu 的
  // 点击路径,closeMenu 必须同时清 openKeys,否则网格弹层
  // (独立 portal 节点)要等鼠标移开才被 hover 逻辑收起
  const [menuOpenKeys, setMenuOpenKeys] = useState<string[]>([]);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [videoModalOpen, setVideoModalOpen] = useState(false);

  const {isCodeInline, isCodeBlock, isInCodeBlock, canCL, dividerDisabled} = useEditorState({
    editor,
    selector: ({editor}) => {
      const {state} = editor;
      return {
        isCodeInline: editor.isActive(BLOCK_TYPES.CODE_INLINE),
        isCodeBlock: editor.isActive(BLOCK_TYPES.CODE),
        isInCodeBlock: isSelectionInsideBlockByType(editor, BLOCK_TYPES.CODE),
        canCL: editor.can().chain().toggleTaskList?.().run(),
        dividerDisabled:
          isInTable(state) || isNodeSelection(state.selection) || isInListSelection(state),
      };
    },
  });

  const closeMenu = () => {
    setMenuOpen(false);
    setMenuOpenKeys([]);
  };

  // ===== 图片上传(回调链与原 ImageButton 一致)=====
  const imageUploadProps = {
    editor,
    accept: '.jpg,.jpeg,.png,.gif',
    acceptErrMsg: '支持文件格式：jpg、jpeg、png、gif格式',
    multiple: true,
    beforeUpload: imageProps.onImageBeforeUpload,
    onError: (_: Error, __a: Record<string, unknown>, file: RcFile) => {
      const uploadKey = (file as any).__imageUploadKey;
      if (!uploadKey) return;
      editor.commands.updateImageByUploadKey(uploadKey, {src: undefined, isError: true});
      removeImageProgress(editor, uploadKey);
    },
    onProgress: (event: { percent: number }, file: RcFile) => {
      const uploadKey = (file as any).__imageUploadKey;
      if (!uploadKey) return;
      updateImageProgress(editor, uploadKey, event.percent);
    },
    onStart: async (file: RcFile) => {
      const uploadKey = uuid();
      (file as any).__imageUploadKey = uploadKey;
      imageProps.onImageStartUpload?.();
      const {width: naturalWidth, height: naturalHeight} = await getImageSizeFromFile(file);
      const editorWidth = editor.view.dom.clientWidth;
      const scale = naturalWidth > editorWidth ? editorWidth / naturalWidth : 1;
      editor
        .chain()
        .focus()
        .setImage({
          uploadKey,
          src: URL.createObjectURL(file),
          width: naturalWidth * scale,
          height: naturalHeight * scale,
        })
        .run();
      updateImageProgress(editor, uploadKey, 0);
    },
    onSuccess: (res: { data: string }, file: RcFile) => {
      const uploadKey = (file as any).__imageUploadKey;
      if (!uploadKey) return;
      editor.commands.updateImageByUploadKey(uploadKey, {src: res.data});
      removeImageProgress(editor, uploadKey);
      imageProps.onImageEndUpload?.();
    },
    maxFileSize: imageProps.maxFileSize,
    customRequest: makeCustomRequest(imageProps.onImageUpload),
  };

  // ===== 视频上传(回调链与原 VideoButton 一致)=====
  const videoUploadProps = videoProps
    ? {
      editor,
      uploaderKey: 'videoUploader' as const,
      accept: videoProps.accept ?? '.mp4,.webm,.mov,.m4v',
      acceptErrMsg: '支持的视频格式：mp4、webm、mov、m4v',
      multiple: true,
      beforeUpload: videoProps.onVideoBeforeUpload,
      onError: (_: Error, __a: Record<string, unknown>, file: RcFile) => {
        const uploadKey = (file as any).__videoUploadKey;
        if (!uploadKey) return;
        editor.commands.updateVideoByUploadKey(uploadKey, {src: undefined, isError: true});
        removeUploadProgress(editor, uploadKey);
      },
      onProgress: (event: { percent: number }, file: RcFile) => {
        const uploadKey = (file as any).__videoUploadKey;
        if (!uploadKey) return;
        updateUploadProgress(editor, uploadKey, event.percent);
      },
      onStart: (file: RcFile) => {
        const uploadKey = uuid();
        (file as any).__videoUploadKey = uploadKey;
        videoProps.onVideoStartUpload?.();
        editor
          .chain()
          .focus()
          .setVideo({
            uploadKey,
            src: URL.createObjectURL(file),
            name: file.name,
            size: file.size,
          })
          .run();
        updateUploadProgress(editor, uploadKey, 0);
      },
      onSuccess: (res: { data: string }, file: RcFile) => {
        const uploadKey = (file as any).__videoUploadKey;
        if (!uploadKey) return;
        editor.commands.updateVideoByUploadKey(uploadKey, {src: res.data});
        removeUploadProgress(editor, uploadKey);
        videoProps.onVideoEndUpload?.();
      },
      maxFileSize: videoProps.maxFileSize,
      customRequest: makeCustomRequest(videoProps.onVideoUpload),
    }
    : null;

  // ===== 附件上传(回调链与原 FileButton 一致)=====
  const fileUploadProps = fileProps
    ? {
      editor,
      uploaderKey: 'fileUploader' as const,
      accept: fileProps.accept ?? '*',
      acceptErrMsg: IntlComponent.get('file.upload.unsupported.format'),
      multiple: true,
      beforeUpload: fileProps.onFileBeforeUpload,
      onError: (_: Error, __a: Record<string, unknown>, file: RcFile) => {
        const uploadKey = (file as any).__fileUploadKey;
        if (!uploadKey) return;
        editor.commands.updateFileByUploadKey(uploadKey, {isError: true});
        removeUploadProgress(editor, uploadKey);
      },
      onProgress: (event: { percent: number }, file: RcFile) => {
        const uploadKey = (file as any).__fileUploadKey;
        if (!uploadKey) return;
        updateUploadProgress(editor, uploadKey, event.percent);
      },
      onStart: (file: RcFile) => {
        const uploadKey = uuid();
        (file as any).__fileUploadKey = uploadKey;
        fileProps.onFileStartUpload?.();
        const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
        editor
          .chain()
          .focus()
          .setFile({uploadKey, name: file.name, size: file.size, ext, src: ''})
          .run();
        updateUploadProgress(editor, uploadKey, 0);
      },
      onSuccess: (res: { data: string }, file: RcFile) => {
        const uploadKey = (file as any).__fileUploadKey;
        if (!uploadKey) return;
        editor.commands.updateFileByUploadKey(uploadKey, {src: res.data});
        removeUploadProgress(editor, uploadKey);
        fileProps.onFileEndUpload?.();
      },
      maxFileSize: fileProps.maxFileSize,
      customRequest: makeCustomRequest(fileProps.onFileUpload),
    }
    : null;

  const options: TextoryMenuItem[] = [
    {
      key: 'taskList',
      icon: <Iconfont type="icon-check"/>,
      label: IntlComponent.get('insert.taskList'),
      disabled: disabled || !canCL,
      onClick: () => editor.chain().focus().toggleTaskList().run(),
    },
    {
      key: 'divider',
      icon: <Iconfont type="icon-divider"/>,
      label: IntlComponent.get('divider'),
      disabled: disabled || isInCodeBlock || dividerDisabled,
      onClick: () => editor.chain().focus().setHorizontalRule().run(),
    },
    {
      key: 'codeBlockGroup',
      icon: <Iconfont type="icon-code"/>,
      label:IntlComponent.get('code'),
      children:[{
        key:'codeInline',
        icon: <Iconfont type="icon-code-inline" />,
        label: isCodeInline
          ? IntlComponent.get('code.inline.remove')
          : IntlComponent.get('code.inline.insert'),
        onClick: () => editor?.chain().focus().toggleCode?.().run(),
      }, {
        key:'codeBlock',
        icon: <Iconfont type="icon-code" />,
        label: isCodeBlock
          ? IntlComponent.get('codeBlock.inline.remove')
          : IntlComponent.get('codeBlock.inline.insert'),
        onClick: () => editor.chain().focus().toggleCodeBlock().run()
      }]
    },
    {
      key: 'table',
      icon: <Iconfont type="icon-table"/>,
      label: IntlComponent.get('table'),
      disabled: disabled || isInCodeBlock,
      popupContent: (
        <InsertTablePanel
          onEsc={closeMenu}
          onClick={(rows, cols) => {
            editor.chain().focus().insertTable({rows, cols, withHeaderRow: true}).run();
            closeMenu();
          }}
        />
      ),
    },
    {
      key: 'image',
      icon: <Iconfont type="icon-image"/>,
      label: IntlComponent.get('image.insert'),
      disabled: disabled || isInCodeBlock,
      children: [
        {
          key: 'image-network',
          label: IntlComponent.get('insert.image.network'),
          onClick: () => setImageModalOpen(true),
        },
        {
          key: 'image-local',
          label: (
            <Upload {...imageUploadProps}>
              <span>{IntlComponent.get('insert.image.local')}</span>
            </Upload>
          ),
        },
      ],
    },
    ...(videoProps
      ? [
        {
          key: 'video',
          icon: <Iconfont type="icon-video"/>,
          label: IntlComponent.get('video.insert'),
          disabled: disabled || isInCodeBlock,
          children: [
            {
              key: 'video-network',
              label: IntlComponent.get('video.network.insert'),
              onClick: () => setVideoModalOpen(true),
            },
            {
              key: 'video-local',
              label: (
                <Upload {...videoUploadProps!}>
                  <span>{IntlComponent.get('video.local.upload')}</span>
                </Upload>
              ),
            },
          ],
        } satisfies TextoryMenuItem,
      ]
      : []),
    ...(fileUploadProps
      ? [
        {
          key: 'file',
          icon: <Iconfont type="icon-file"/>,
          label: (
            <Upload {...fileUploadProps}>
              <span>{IntlComponent.get('file.toolbar')}</span>
            </Upload>
          ),
          disabled: disabled || isInCodeBlock,
        } satisfies TextoryMenuItem,
      ]
      : []),
  ]

  return (
    <>
      <ToolbarItemButtonWrapper
        intlStr={intlStr}
        className={cx('textory-toolbar__item__btn', 'textory-toolbar__item__dropdown')}
        style={style}
        disabled={disabled}
      >
        <Dropdown
          visible={menuOpen}
          disabled={disabled}
          className={cx('textory-toolbar__item__dropdown', disabled && 'dropdown-disabled')}
          // getPopupContainer={node => node.parentNode as HTMLElement}
          popupAlign={{points: ['tl', 'bl']}}
          onVisibleChange={open => (open ? setMenuOpen(true) : closeMenu())}
          popup={
            <TextoryMenu
              options={options}
              openKeys={menuOpenKeys}
              onOpenChange={setMenuOpenKeys}
              onCloseAll={closeMenu}
            />
          }
        >
          <div className="textory-toolbar__insert_btn_text">
            {IntlComponent.get('toolbar.insert')}
          </div>
        </Dropdown>
      </ToolbarItemButtonWrapper>
      <UploadNetworkImageModal
        open={imageModalOpen}
        onClose={() => setImageModalOpen(false)}
        onSubmit={data => {
          editor.chain().focus().setImage(data).run();
        }}
      />
      <UploadNetworkVideoModal
        open={videoModalOpen}
        onClose={() => setVideoModalOpen(false)}
        onSubmit={data => {
          editor
            .chain()
            .focus()
            .setVideo({src: data.src, ...(data.poster ? {poster: data.poster} : {})})
            .run();
        }}
      />
    </>
  );
};
export default InsertGroupButton;
