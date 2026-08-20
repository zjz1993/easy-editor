import {memo, useCallback, useEffect, useLayoutEffect, useRef, useState} from 'react';
import type {Editor as TiptapEditor} from '@tiptap/react';
import {IntlComponent, Tooltip} from '@textory/editor-common';
import cx from 'classnames';

export interface SearchReplacePanelProps {
  editor: TiptapEditor;
  /** 面板是否可见 */
  open: boolean;
  /** 打开时是否展开替换行（Mod+Alt+F 入口） */
  showReplace: boolean;
  onClose: () => void;
  /** 替换行展开状态由面板自持，这里上报以便快捷键入口联动 */
  onToggleReplace: (show: boolean) => void;
}

interface PanelUiState {
  resultCount: number;
  activeIndex: number;
}

/**
 * 搜索替换浮层面板（编辑区右上角，VSCode 风格）。
 *
 * 计数状态通过订阅 editor transaction 从扩展 storage 读取
 * （与 CharacterCountBar 同模式）；不使用 useEditorState，因为
 * matches 是 plugin state，不进入 Tiptap 的可观察 selector。
 */
const SearchReplacePanel = memo<SearchReplacePanelProps>(
  ({editor, open, showReplace, onClose, onToggleReplace}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [replaceText, setReplaceText] = useState('');
    const [caseSensitive, setCaseSensitive] = useState(false);
    const [wholeWord, setWholeWord] = useState(false);
    const [{resultCount, activeIndex}, setUiState] = useState<PanelUiState>({
      resultCount: 0,
      activeIndex: -1,
    });
    const searchInputRef = useRef<HTMLInputElement>(null);

    // 订阅 transaction 同步扩展 storage 的计数到本地 state
    useEffect(() => {
      const sync = () => {
        const {resultCount, activeIndex} = editor.storage.searchReplace ?? {
          resultCount: 0,
          activeIndex: -1,
        };
        setUiState((prev) =>
          prev.resultCount === resultCount && prev.activeIndex === activeIndex
            ? prev
            : {resultCount, activeIndex},
        );
      };
      editor.on('transaction', sync);
      sync();
      return () => {
        editor.off('transaction', sync);
      };
    }, [editor]);

    // 打开时恢复上次搜索词（高亮重算）并聚焦输入框；关闭时只清高亮
    useEffect(() => {
      if (open) {
        if (searchTerm) {
          editor.commands.setSearchTerm(searchTerm);
        }
        searchInputRef.current?.focus();
        searchInputRef.current?.select();
      } else {
        editor.commands.clearSearch();
      }
    }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

    const hasResult = resultCount > 0;

    const handleSearchInput = useCallback(
      (value: string) => {
        setSearchTerm(value);
        editor.commands.setSearchTerm(value);
      },
      [editor],
    );

    const toggleCaseSensitive = useCallback(() => {
      setCaseSensitive((prev) => {
        const next = !prev;
        editor.commands.setSearchOptions({caseSensitive: next});
        return next;
      });
    }, [editor]);

    const toggleWholeWord = useCallback(() => {
      setWholeWord((prev) => {
        const next = !prev;
        editor.commands.setSearchOptions({wholeWord: next});
        return next;
      });
    }, [editor]);

    const handleReplaceNext = useCallback(() => {
      if (!hasResult) return;
      editor.commands.replaceNext(replaceText);
      editor.commands.goToMatch('next');
    }, [editor, replaceText, hasResult]);

    const handleReplaceAll = useCallback(() => {
      if (!hasResult) return;
      editor.commands.replaceAll(replaceText);
    }, [editor, replaceText, hasResult]);

    // 面板内键盘行为：Esc 关闭；搜索框 Enter 跳转匹配
    const handleKeyDown = useCallback(
      (event: React.KeyboardEvent) => {
        if (event.key === 'Escape') {
          event.preventDefault();
          onClose();
          editor.commands.focus();
          return;
        }
        if (event.key === 'Enter' && event.target === searchInputRef.current) {
          event.preventDefault();
          editor.commands.goToMatch(event.shiftKey ? 'prev' : 'next');
        }
      },
      [editor, onClose],
    );

    return (
      <div
        className={cx('textory-search-panel', {'is-open': open})}
        data-open={open || undefined}
        onKeyDown={handleKeyDown}
        hidden={!open}
      >
        <div className="textory-search-panel__row">
          <button
            type="button"
            className={cx('textory-search-panel__icon-btn', {
              'is-active': showReplace,
            })}
            title={IntlComponent.get('search.replace.toggle') || '切换替换'}
            onClick={() => onToggleReplace(!showReplace)}
          >
            <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">
              <path
                d={showReplace ? 'M4 6l4 4 4-4' : 'M6 4l4 4-4 4'}
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
          </button>
          <div
            className={cx('textory-search-panel__input-wrap', {
              'is-empty-result': searchTerm !== '' && !hasResult,
            })}
          >
            <input
              ref={searchInputRef}
              className="textory-search-panel__input"
              value={searchTerm}
              placeholder={IntlComponent.get('search.placeholder') || '搜索'}
              onChange={(event) => handleSearchInput(event.target.value)}
            />
            <Tooltip content={IntlComponent.get('search.caseSensitive')}>
              <button
                type="button"
                className={cx('textory-search-panel__toggle', {'is-active': caseSensitive})}
                onClick={toggleCaseSensitive}
              >
                Aa
              </button>
            </Tooltip>
            <Tooltip content={IntlComponent.get('search.wholeWord')}>
              <button
                type="button"
                className={cx('textory-search-panel__toggle', {'is-active': wholeWord})}
                onClick={toggleWholeWord}
              >
                ab|
              </button>
            </Tooltip>
            <span className="textory-search-panel__count">
              {searchTerm === ''
                ? ''
                : hasResult
                  ? `${activeIndex + 1}/${resultCount}`
                  : IntlComponent.get('search.noResult') || '无结果'}
            </span>
          </div>
          <button
            type="button"
            className="textory-search-panel__icon-btn"
            title={IntlComponent.get('search.prev') || '上一个'}
            disabled={!hasResult}
            onClick={() => editor.commands.goToMatch('prev')}
          >
            <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">
              <path d="M4 11l4-6 4 6" fill="none" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>
          <button
            type="button"
            className="textory-search-panel__icon-btn"
            title={IntlComponent.get('search.next') || '下一个'}
            disabled={!hasResult}
            onClick={() => editor.commands.goToMatch('next')}
          >
            <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">
              <path d="M4 5l4 6 4-6" fill="none" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>
          <button
            type="button"
            className="textory-search-panel__icon-btn"
            title={IntlComponent.get('search.close') || '关闭'}
            onClick={onClose}
          >
            <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">
              <path d="M4 4l8 8M12 4l-8 8" fill="none" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>
        </div>
        {showReplace && (
          <div className="textory-search-panel__row">
            <span className="textory-search-panel__replace-indent" />
            <div className="textory-search-panel__input-wrap">
              <input
                className="textory-search-panel__input"
                value={replaceText}
                placeholder={IntlComponent.get('search.replace.placeholder') || '替换'}
                onChange={(event) => setReplaceText(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    handleReplaceNext();
                  }
                }}
              />
            </div>
            <button
              type="button"
              className="textory-search-panel__text-btn"
              disabled={!hasResult}
              onClick={handleReplaceNext}
            >
              {IntlComponent.get('search.replace') || '替换'}
            </button>
            <button
              type="button"
              className="textory-search-panel__text-btn"
              disabled={!hasResult}
              onClick={handleReplaceAll}
            >
              {IntlComponent.get('search.replaceAll') || '全部替换'}
            </button>
          </div>
        )}
      </div>
    );
  },
);
SearchReplacePanel.displayName = 'SearchReplacePanel';

export default SearchReplacePanel;
