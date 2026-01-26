// OutlineView.tsx
import {useEffect, useState} from 'react';
import Tree from 'rc-tree';
import 'rc-tree/assets/index.css';

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
  if (treeData.length === 0) {
    return null;
  }

  return (
    <div className="textory-outline">
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
