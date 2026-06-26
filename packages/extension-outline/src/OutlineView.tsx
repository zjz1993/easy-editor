// OutlineView.tsx
import {useEffect, useState} from 'react';
import Tree from './components/Tree';

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
      label: i.text,
      children: convertOutlineToTree(i.children),
    }));
  if (treeData.length === 0) {
    return null;
  }

  return (
    <div className="textory-outline">
      <Tree
        data={treeData}
        //onSelect={({ key }) => {
        //  editor.commands.focus();
        //  editor.commands.setTextSelection(Number(key));
        //}}
      />
    </div>
  );
};
