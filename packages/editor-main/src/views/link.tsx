// import IconFont from '@/Editor/components/IconFont/index';
import {type NodeViewProps, NodeViewWrapper} from '@tiptap/react';
//import { Popover, Space, Tooltip } from 'antd';
import {type FC, useState} from 'react';
// import LinkEditPopover from './linkEditPopover';
import './link.scss';

export interface CustomLinkAttrs {
  href: string;
  text: string;
}

const CustomLinkView: FC<NodeViewProps> = props => {
  //console.log('view的props是', props);
  const [editVisible, setEditVisible] = useState(false);
  const [inEdit, setInEdit] = useState(false);
  const { node, editor, getPos } = props;
  const { isEditable } = editor;
  const { attrs, nodeSize } = node;
  const { href, text } = attrs;

  const removeAndInsertText = () => {
    const { state, view } = editor;
    const { tr } = editor.state;
    const position = getPos();
    const textNode = state.schema.text(text);
    //let newTr = tr.delete(position, position + node.nodeSize);
    //newTr.replaceWith(position, position + node.nodeSize, textNode);
    //view.dispatch(newTr);
    const { $from } = editor.state.selection;
    const parentType = $from.parent.type.name;
    console.log('parentType是', parentType);
    editor
      .chain()
      .focus()
      .setNode('paragraph')
      .insertContent('Example Text')
      .run();
  };

  return (
    <NodeViewWrapper className="react-node">
      <a target="_blank" href={href} rel="noreferrer">
        {text}
      </a>
      {/*<Popover*/}
      {/*  open={editVisible}*/}
      {/*  onOpenChange={visible => {*/}
      {/*    if (!isEditable) {*/}
      {/*      setEditVisible(false);*/}
      {/*    } else {*/}
      {/*      setEditVisible(visible);*/}
      {/*    }*/}
      {/*  }}*/}
      {/*  content={*/}
      {/*    <div className="kms-textarea-link-view">*/}
      {/*      {inEdit ? (*/}
      {/*        <LinkEditPopover*/}
      {/*          text={text}*/}
      {/*          href={href}*/}
      {/*          onCancel={() => {*/}
      {/*            setInEdit(false);*/}
      {/*          }}*/}
      {/*          onSubmit={data => {*/}
      {/*            console.log('接收到的是', data);*/}
      {/*            const submitData = data;*/}
      {/*            if (!submitData.text) {*/}
      {/*              submitData.text = submitData.href;*/}
      {/*            }*/}
      {/*            if (editor) {*/}
      {/*              const { tr } = editor.state;*/}
      {/*              const { dispatch } = editor.view;*/}
      {/*              const pos = getPos();*/}
      {/*              tr.replaceWith(*/}
      {/*                pos,*/}
      {/*                pos + nodeSize,*/}
      {/*                editor.state.schema.nodes.custom_link.create(submitData),*/}
      {/*              );*/}
      {/*              dispatch(tr);*/}
      {/*              setEditVisible(false);*/}
      {/*              setInEdit(false);*/}
      {/*            }*/}
      {/*          }}*/}
      {/*        />*/}
      {/*      ) : (*/}
      {/*        <Fragment>*/}
      {/*          <a*/}
      {/*            target="_blank"*/}
      {/*            href={href}*/}
      {/*            rel="noreferrer"*/}
      {/*            className="link"*/}
      {/*          >*/}
      {/*            {text}*/}
      {/*          </a>*/}
      {/*          <Space>*/}
      {/*            <Tooltip title="编辑">*/}
      {/*              <IconFont*/}
      {/*                type="edit"*/}
      {/*                className="edit_icon icon"*/}
      {/*                onClick={() => {*/}
      {/*                  setInEdit(true);*/}
      {/*                }}*/}
      {/*              />*/}
      {/*            </Tooltip>*/}
      {/*            <Tooltip title="取消链接为普通文本">*/}
      {/*              <IconFont*/}
      {/*                type="unlink"*/}
      {/*                className="icon"*/}
      {/*                onClick={() => {*/}
      {/*                  console.log('node是', node);*/}
      {/*                  removeAndInsertText();*/}
      {/*                  //const { dispatch } = editor.view;*/}
      {/*                  //// 通过 transaction 替换节点*/}
      {/*                  //const pos = getPos();*/}
      {/*                  //let tr = editor.state.tr.delete(pos, pos + nodeSize);*/}
      {/*                  //tr = tr.insertText(text, pos);*/}
      {/*                  //dispatch(tr);*/}
      {/*                  console.log('After:', editor.view.state.doc.toString());*/}
      {/*                }}*/}
      {/*              />*/}
      {/*            </Tooltip>*/}
      {/*            <Tooltip title="删除链接">*/}
      {/*              <IconFont*/}
      {/*                type="remove"*/}
      {/*                className="remove_icon icon"*/}
      {/*                onClick={() => {*/}
      {/*                  if (editor) {*/}
      {/*                    const pos = getPos();*/}
      {/*                    console.log('pos是', pos);*/}
      {/*                    const { tr } = editor.state;*/}
      {/*                    const { dispatch } = editor.view;*/}

      {/*                    // 删除当前节点*/}
      {/*                    tr.delete(pos, pos + nodeSize);*/}
      {/*                    dispatch(tr);*/}
      {/*                  }*/}
      {/*                }}*/}
      {/*              />*/}
      {/*            </Tooltip>*/}
      {/*          </Space>*/}
      {/*        </Fragment>*/}
      {/*      )}*/}
      {/*    </div>*/}
      {/*  }*/}
      {/*>*/}
      {/*  <a target="_blank" href={href} rel="noreferrer">*/}
      {/*    {text}*/}
      {/*  </a>*/}
      {/*</Popover>*/}
    </NodeViewWrapper>
  );
};
export default CustomLinkView;
