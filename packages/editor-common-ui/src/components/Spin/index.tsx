import type {FC, ReactNode} from 'react';
import {type Easing, motion} from 'framer-motion';

export interface SpinProps {
  spinning?: boolean;
  size?: 'small | default | large';
  tip?: string;
  children?: ReactNode;
}

const Spin: FC<SpinProps> = ({
  spinning = true, // 控制是否旋转
  size = 'default', // 大小：small | default | large
  tip = '', // 提示文字
  children, // 包裹的内容
}) => {
  // 根据 size 确定尺寸
  const sizeMap = {
    small: 16,
    default: 24,
    large: 32,
  };

  const spinSize = sizeMap[size] || sizeMap.default;

  // 旋转动画配置
  const spinVariants = {
    spin: {
      rotate: 360,
      transition: {
        duration: 1,
        ease: 'linear' as Easing,
        repeat: Number.POSITIVE_INFINITY,
      },
    },
    stop: {
      rotate: 0,
      transition: {
        duration: 0,
      },
    },
  };

  // 如果有 children，则作为包裹加载器使用
  const renderContent = () => {
    if (children) {
      return (
        <div className="spin-nested-container">
          <div className={`spin-overlay ${spinning ? 'spinning' : ''}`}>
            {spinning && (
              <motion.div
                className="spin-indicator"
                style={{ width: spinSize, height: spinSize }}
                variants={spinVariants}
                animate={spinning ? 'spin' : 'stop'}
              />
            )}
          </div>
          <div className="spin-content" style={{ opacity: spinning ? 0.5 : 1 }}>
            {children}
          </div>
        </div>
      );
    }

    // 没有 children 时，显示独立的加载指示器
    return (
      <div className="spin-container">
        <motion.div
          className="spin-indicator"
          style={{ width: spinSize, height: spinSize }}
          variants={spinVariants}
          animate={spinning ? 'spin' : 'stop'}
        />
        {tip && <div className="spin-tip">{tip}</div>}
      </div>
    );
  };

  return <>{renderContent()}</>;
};
export default Spin;
