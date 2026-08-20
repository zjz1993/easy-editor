import {useCallback, useState} from 'react';
import type {KeyboardEvent as ReactKeyboardEvent} from 'react';

export interface SearchReplaceUI {
  /** 搜索面板是否可见 */
  isSearchOpen: boolean;
  /** 替换行是否展开（Mod+Alt+F 入口直接展开） */
  isSearchReplaceVisible: boolean;
  /**
   * 挂在编辑器容器上的 keydown：Mod+F 打开搜索、Mod+Alt+F 打开并展开替换行。
   * 由 root.tsx 在 features.searchReplace 开启且可编辑时挂载；
   * preventDefault 阻止浏览器默认搜索行为。
   */
  handleSearchHotkey: (event: ReactKeyboardEvent) => void;
  handleCloseSearch: () => void;
  handleToggleReplaceRow: (show: boolean) => void;
}

/**
 * 搜索替换面板的 UI 开关状态（面板本体常驻挂载以保留搜索词，
 * 见 layers/SearchLayer）。
 */
export function useSearchReplaceUI(): SearchReplaceUI {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSearchReplaceVisible, setIsSearchReplaceVisible] = useState(false);

  const handleSearchHotkey = useCallback((event: ReactKeyboardEvent) => {
    if (!event.metaKey && !event.ctrlKey) return;
    if (event.key.toLowerCase() !== 'f') return;
    event.preventDefault();
    if (event.altKey) {
      setIsSearchReplaceVisible(true);
    }
    setIsSearchOpen(true);
  }, []);

  const handleCloseSearch = useCallback(() => setIsSearchOpen(false), []);
  const handleToggleReplaceRow = useCallback(
    (show: boolean) => setIsSearchReplaceVisible(show),
    [],
  );

  return {
    isSearchOpen,
    isSearchReplaceVisible,
    handleSearchHotkey,
    handleCloseSearch,
    handleToggleReplaceRow,
  };
}
