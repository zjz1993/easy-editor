import type {FC} from 'react';
import {TreeNode} from './TreeNode';
import type {TreeProps} from './type';

const Tree: FC<TreeProps> = ({ data }) => {
  return (
    <div className="textory-tree">
      {data.map((node, index) => (
        <TreeNode {...node} key={index} />
      ))}
    </div>
  );
};
export default Tree;
