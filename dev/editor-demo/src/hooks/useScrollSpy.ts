// scroll spy hook：根据滚动位置返回当前高亮的 heading id
import { useEffect, useState } from 'react';

interface UseScrollSpyOptions {
  // 监听的容器选择器，默认整个文档
  selector?: string;
  // 顶部偏移（顶栏高度），默认 80
  topOffset?: number;
}

export const useScrollSpy = (
  ids: string[],
  options: UseScrollSpyOptions = {},
): string | null => {
  const { topOffset = 80 } = options;
  const [activeId, setActiveId] = useState<string | null>(ids[0] || null);

  useEffect(() => {
    if (ids.length === 0) return;
    const handle = () => {
      const scrollPos = window.scrollY + topOffset + 4;
      let current: string | null = null;
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.offsetTop <= scrollPos) {
          current = id;
        } else {
          break;
        }
      }
      // 滚动到底部时强制选中最后一个
      if (
        current === null &&
        window.innerHeight + window.scrollY >= document.body.scrollHeight - 8
      ) {
        current = ids[ids.length - 1];
      }
      if (current && current !== activeId) setActiveId(current);
    };
    handle();
    window.addEventListener('scroll', handle, { passive: true });
    window.addEventListener('resize', handle);
    return () => {
      window.removeEventListener('scroll', handle);
      window.removeEventListener('resize', handle);
    };
  }, [ids.join(','), topOffset, activeId]);

  return activeId;
};
