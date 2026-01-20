import type {NodeViewProps} from '@tiptap/core';
import {NodeViewContent, NodeViewWrapper} from '@tiptap/react';
import classNames from 'classnames';
import type React from 'react';
import {useCallback, useMemo, useRef, useState} from 'react';
import {getLanguageByValue, getLanguageByValueOrAlias, languages,} from './languages';
import {BLOCK_TYPES, Dropdown, get, Iconfont, message, smartClipboardCopy,} from '@textory/editor-common';
import {exportCode} from './utils.ts';

const CODE_BLOCK_DROPDOWN_MAX_HEIGHT = 245;

export const CodeBlockNodeView: React.FC<NodeViewProps> = ({
  editor,
  node,
  updateAttributes,
  extension,
  getPos,
}) => {
  const { isEditable } = editor;
  const $container = useRef<HTMLPreElement>(null);
  const inputRef = useRef<HTMLInputElement>();
  const [search, setSearch] = useState('');
  //const [toolbarVisible, setToolbarVisible] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const language =
    node.attrs.language || extension?.options?.defaultLanguage || '';
  const languageItem = useMemo(() => getLanguageByValue(language), [language]);

  const [selectedValue, setSelectedValue] = useState(
    () => getLanguageByValueOrAlias(language)?.value || 'plaintext',
  );
  const selectedLanguageItem = useMemo(
    () => getLanguageByValue(selectedValue),
    [selectedValue],
  );

  const searchedLanguages = useMemo(() => {
    const keyword = search.toLowerCase();
    return languages.filter(
      lang =>
        lang.value.includes(keyword) ||
        lang.alias.includes(keyword) ||
        lang.name.includes(keyword),
    );
  }, [search]);

  const handleOpen = useCallback(() => {
    if (!isEditable) {
      return;
    }
    // setDropdownVisible(prev => !prev);
    setTimeout(() => inputRef.current.focus());
  }, [isEditable]);

  function getCurrentCodeBlockRange() {
    const { $from } = editor.state.selection; // 获取光标位置的解析位置

    // 向上查找 codeBlock 节点
    let codeBlockNode = null;
    let from = null;
    let to = null;

    // 检查光标所在的直接父节点或更高层节点是否为 codeBlock
    for (let depth = $from.depth; depth >= 0; depth--) {
      const node = $from.node(depth);
      if (node.type.name === BLOCK_TYPES.CODE) {
        codeBlockNode = node;
        from = $from.start(depth); // codeBlock 的起始位置
        to = $from.end(depth); // codeBlock 的结束位置
        break;
      }
    }

    if (codeBlockNode) {
      console.log('CodeBlock found:', {
        from,
        to,
        content: codeBlockNode.textContent,
      });
      return { from, to };
    }
    console.log('No codeBlock found at cursor position');
    return null;
  }
  const pureCode = useMemo(() => {
    const type = get(node, 'type.name');
    const content = get(node, 'content');
    if (type !== BLOCK_TYPES.CODE || !content) {
      return '';
    }
    return content.content.map((child: any) => child.text).join('\n');
  }, [node]);
  const focusToCodeBlock = useCallback(() => {
    // 获取当前 codeBlock 的起始位置
    const from = getPos(); // codeBlock 的开头

    // 将光标设置为 codeBlock 的开头（跳过标签，进入内容）
    editor
      .chain()
      .focus() // 确保编辑器聚焦
      .setTextSelection(from + 1) // 设置光标到内容开头
      .run();
  }, [editor, getPos, node]);
  const lineNumbers = useMemo(() => {
    return pureCode.split('\n').map((_, index) => index + 1);
  }, [pureCode]);
  const renderToolbar = () => {
    const copyBtn = (
      <button
        className="textory-code-block__button_area__button"
        onClick={() => {
          smartClipboardCopy(pureCode as string);
        }}
      >
        复制
      </button>
    );
    if (isEditable) {
      return (
        <>
          {copyBtn}
          <button
            onClick={() => {
              exportCode(pureCode as string, language);
            }}
            className="textory-code-block__button_area__button"
          >
            下载
          </button>
          <button
            className="textory-code-block__button_area__button"
            onClick={() => {
              try {
                focusToCodeBlock();
                const res = getCurrentCodeBlockRange();
                editor
                  .chain()
                  .focus() // 确保编辑器聚焦
                  .deleteRange({ from: res.from, to: res.to }) // 删除指定范围
                  .run();
              } catch (e) {
                message.success('操作失败');
              }
            }}
          >
            清空代码块
          </button>
          <button
            className="textory-code-block__button_area__button"
            onClick={() => {
              try {
                focusToCodeBlock();
                const res = getCurrentCodeBlockRange();
                if (res) {
                  editor
                    .chain()
                    .focus() // 确保编辑器聚焦
                    .deleteRange({ from: res.from - 1, to: res.to }) // 删除指定范围
                    .run();
                } else {
                  message.warning('操作失败');
                }
              } catch (e) {
                message.warning('操作失败');
              }
            }}
          >
            删除代码块
          </button>
        </>
      );
    }
    return copyBtn;
  };

  return (
    <NodeViewWrapper
      data-id={node.attrs.id}
      className={classNames(
        node.attrs.className,
        'textory-code-block',
        'textory-block-container',
      )}
      //onMouseEnter={() => setToolbarVisible(true)}
      //onMouseLeave={() => setToolbarVisible(false)}
    >
      <div
        className={classNames('textory-code-block__toolbar')}
        contentEditable={false}
      >
        <Dropdown
          showIcon={isEditable}
          visible={dropdownVisible}
          onVisibleChange={visible => {
            if (!isEditable) {
              return false;
            }
            setDropdownVisible(visible);
          }}
          popup={
            <div className="textory-dropdown-menu textory-code-block__dropdown">
              <div
                className="textory-dropdown-menu__content"
                style={{
                  maxHeight: CODE_BLOCK_DROPDOWN_MAX_HEIGHT,
                }}
              >
                <div className="textory-code-block__dropdown-search">
                  <div className="textory-code-block__dropdown-input">
                    <input
                      ref={inputRef}
                      type="text"
                      value={search}
                      placeholder="搜索"
                      onChange={e => setSearch(e.target.value)}
                    />
                    {search.length > 0 && (
                      <Iconfont
                        type="icon-close-circle-fill"
                        className="icon"
                        onClick={() => setSearch('')}
                      />
                    )}
                  </div>
                </div>
                <div className="textory-code-block__dropdown-list">
                  {searchedLanguages.map(lang => (
                    <div
                      key={lang.value}
                      className={classNames('textory-dropdown-menu__item', {
                        'textory-dropdown-menu__item--active':
                          selectedValue === lang.value,
                      })}
                      onClick={() => {
                        setSelectedValue(lang.value);
                        updateAttributes({ language: lang.value });
                        setDropdownVisible(false);
                      }}
                    >
                      {lang.name}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          }
        >
          {isEditable ? (
            <div
              className="textory-dropdown-trigger textory-code-block__dropdown-trigger"
              onClick={handleOpen}
            >
              <span>{selectedLanguageItem?.name || selectedValue}</span>
            </div>
          ) : (
            <span>{languageItem?.name || language}</span>
          )}
        </Dropdown>
        <div className="textory-code-block__button_area">
          {renderToolbar()}
        </div>
      </div>
      <div className="textory-code-block__content-wrapper">
        <div className="textory-code-block__line-numbers">
          {lineNumbers.map(num => (
            <div key={num} className="textory-code-block__line-numbers-row">
              {num}
            </div>
          ))}
        </div>
        <div className="textory-code-block__content">
          <pre className={classNames('hljs')} ref={$container}>
            <NodeViewContent as="div" />
          </pre>
        </div>
      </div>
    </NodeViewWrapper>
  );
};
