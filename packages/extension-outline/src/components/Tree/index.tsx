import type {FC} from 'react';
import {TreeNode} from './TreeNode';
import type {TreeProps} from './type';

const Tree: FC<TreeProps> = ({
  data,
  activeKey,
  expandedKeys,
  onSelect,
  onToggle,
}) => {
  return (
    <div className="textory-tree">
      {data.map((node) => (
        <TreeNode
          key={node.id}
          id={node.id}
          label={node.label}
          activeKey={activeKey}
          expandedKeys={expandedKeys}
          onSelect={onSelect}
          onToggle={onToggle}
        >{node.children}</TreeNode>
      ))}
    </div>
  );
};
export default Tree;
