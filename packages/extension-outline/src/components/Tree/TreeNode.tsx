import {type FC, useState} from 'react';
import {AnimatePresence, motion} from "framer-motion";
import type {TreeNodeProps} from './type';

const TreeNode: FC<TreeNodeProps> = ({ label, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const hasChildren = children && children.length > 0;

  const toggle = () => {
    if (hasChildren) {
      setIsOpen(!isOpen);
    }
  };

  // 子节点展开动画变体：高度和透明度
  const containerVariants = {
    open: { opacity: 1, height: 'auto' },
    collapsed: { opacity: 0, height: 0 },
  };

  // 箭头旋转动画变体：收起时 0 度（▶），展开时 90 度（▼）
  const arrowVariants = {
    open: { rotate: 90 },
    closed: { rotate: 0 },
  };

  return (
    <div className="textory-tree-node">
      {/* 节点头部：箭头 + 文本 */}
      <div className="node-header" onClick={toggle}>
        {hasChildren && (
          <motion.span
            className="toggle-icon"
            variants={arrowVariants}
            animate={isOpen ? 'open' : 'closed'}
            transition={{ duration: 0.3, ease: 'easeInOut' }} // 与子节点动画同步
          >
            ▶ {/* 固定为右箭头，旋转后变为下箭头 */}
          </motion.span>
        )}
        <span className="node-label">{label}</span>
      </div>

      {/* 子节点：使用 AnimatePresence 和 motion.div 实现动画 */}
      <AnimatePresence>
        {isOpen && hasChildren && (
          <motion.div
            className="children" // 保持缩进样式
            variants={containerVariants}
            initial="collapsed"
            animate="open"
            exit="collapsed"
            transition={{ duration: 0.3, ease: 'easeInOut' }} // 动画时长和缓动函数，可自定义
          >
            {children.map((child, index) => (
              <TreeNode key={index} {...child} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
export { TreeNode };
