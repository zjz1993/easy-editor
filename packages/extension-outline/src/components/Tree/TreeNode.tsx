import type {FC} from 'react';
import {AnimatePresence, motion} from 'framer-motion';
import type {TreeNodeProps} from './type';

interface TreeNodeExtendedProps extends TreeNodeProps {
  /** Currently active heading key */
  activeKey?: string | null;
  /** Set of expanded node keys */
  expandedKeys: Set<string>;
  /** Called when label is clicked (scroll to heading) */
  onSelect?: (key: string) => void;
  /** Called when expand/collapse arrow is toggled */
  onToggle?: (key: string) => void;
}

const TreeNode: FC<TreeNodeExtendedProps> = ({
                                               id,
                                               label,
                                               children,
                                               activeKey,
                                               expandedKeys,
                                               onSelect,
                                               onToggle,
                                             }) => {
  const hasChildren = children && children.length > 0;
  const isOpen = expandedKeys.has(id);
  const isActive = activeKey === id;

  const toggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasChildren) {
      onToggle?.(id);
    }
  };

  const handleSelect = () => {
    onSelect?.(id);
  };

  // 子节点展开动画变体：高度和透明度
  const containerVariants = {
    open: {opacity: 1, height: 'auto'},
    collapsed: {opacity: 0, height: 0},
  };

  // 箭头旋转动画变体：收起时 0 度（▶），展开时 90 度（▼）
  const arrowVariants = {
    open: {rotate: 90},
    closed: {rotate: 0},
  };

  return (
    <div className="textory-tree-node" data-outline-key={id}>
      {/* 节点头部：箭头 + 文本。点击 label 触发 onSelect（滚动） */}
      <div
        className={`node-header${isActive ? ' is-active' : ''}`}
        onClick={handleSelect}
      >
        {hasChildren && (
          <motion.span
            className="toggle-icon"
            variants={arrowVariants}
            animate={isOpen ? 'open' : 'closed'}
            transition={{duration: 0.3, ease: 'easeInOut'}}
            onClick={toggle}
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
            transition={{duration: 0.3, ease: 'easeInOut'}}
          >
            {children.map((child) => (
              <TreeNode
                key={child.id}
                id={child.id}
                label={child.label}
                activeKey={activeKey}
                expandedKeys={expandedKeys}
                onSelect={onSelect}
                onToggle={onToggle}
              >{child.children}</TreeNode>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export {TreeNode};
