import { useEffect, useState } from 'react';
import type {FeatureFlags} from '@textory/context';

/**
 * features 只在 mount 时生效，运行时变更不会重新加载扩展。
 * 检测到变更时输出 console.warn 提醒调用方。
 *
 * 初始快照用 useState 惰性初始化（而非 render 期写 ref），
 * 避免 react-doctor 的 no-ref-current-in-render。
 */
export function useFeaturesWarning(features: FeatureFlags | undefined) {
  const [initialFeatures] = useState(() => JSON.stringify(features ?? {}));

  useEffect(() => {
    const current = JSON.stringify(features ?? {});
    if (current !== initialFeatures) {
      console.warn(
        '[EasyEditor] features 只在初始化时生效，运行时修改不会重新加载扩展。' +
          '如需切换，请给 <Editor> 加 key 强制 remount，例如：<Editor key={JSON.stringify(features)} features={features} />',
      );
    }
  }, [features, initialFeatures]);
}
