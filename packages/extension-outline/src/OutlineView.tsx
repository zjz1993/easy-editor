// OutlineView.tsx
import {useEffect, useState} from 'react'
import Tree from "rc-tree";
import "rc-tree/assets/index.css"

export const OutlineView = ({ editor }) => {
  const [treeData, setTreeData] = useState([]);

  useEffect(() => {
    if (!editor) return;

    // 初始化一次
    updateOutline();

    // 每次编辑器更新同步
    const unsubscribe = editor.on('update', updateOutline);

    //return () => unsubscribe();
  }, [editor]);

  const updateOutline = () => {
    const outline = editor.storage.outline.outline;
    setTreeData(convertOutlineToTree(outline));
  };

  const convertOutlineToTree = items =>
    items.map(i => ({
      key: String(i.pos),
      title: i.text,
      children: convertOutlineToTree(i.children),
    }));

  return (
    <div style={{ width: 260, borderRight: '1px solid #eee', padding: '8px' }}>
      <Tree
        checkable={false}
        treeData={treeData}
        //onSelect={({ key }) => {
        //  editor.commands.focus();
        //  editor.commands.setTextSelection(Number(key));
        //}}
      />
    </div>
  );
};
