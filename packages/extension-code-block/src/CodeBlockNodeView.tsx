import type {NodeViewProps} from '@tiptap/core';
import {NodeViewContent, NodeViewWrapper} from '@tiptap/react';
import classNames from 'classnames';
import copy from 'copy-to-clipboard';
import prettier from 'prettier';
import babelPlugin from 'prettier/plugins/babel';
import estreePlugin from 'prettier/plugins/estree';
import htmlPlugin from 'prettier/plugins/html';
import typescriptPlugin from 'prettier/plugins/typescript';
import type React from 'react';
import {useCallback, useMemo, useRef, useState} from 'react';
import {getLanguageByValue, getLanguageByValueOrAlias, languages,} from './languages';
import './CodeBlockNodeView.scss';
import {BLOCK_TYPES, Dropdown, get, Iconfont, message,} from '@easy-editor/editor-common';
import {TextSelection} from '@tiptap/pm/state';

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

  const formatCode = async (
    code: string,
    language: string = 'javascript',
  ): Promise<string> => {
    try {
      // 根据语言选择 Prettier 的解析器
      const parser =
        language === 'typescript'
          ? 'typescript'
          : language === 'html'
            ? 'html'
            : 'babel';

      // 需要传入正确的解析插件
      const plugins = [babelPlugin, typescriptPlugin, htmlPlugin, estreePlugin];

      return await prettier.format(code, {
        parser,
        plugins,
        tabWidth: 2,
        semi: true,
        singleQuote: false,
      });
    } catch (error) {
      message.warning('格式化失败');
      console.log('error', error);
      return code; // 失败时返回原代码
    }
  };
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

  return (
    <NodeViewWrapper
      data-id={node.attrs.id}
      className={classNames(node.attrs.className, 'easy-editor-code-block')}
      //onMouseEnter={() => setToolbarVisible(true)}
      //onMouseLeave={() => setToolbarVisible(false)}
    >
      <div
        className={classNames('easy-editor-code-block__toolbar')}
        contentEditable={false}
      >
        <Dropdown
          visible={dropdownVisible}
          onVisibleChange={visible => {
            setDropdownVisible(visible);
          }}
          popup={
            <div className="easy-editor-dropdown-menu easy-editor-code-block__dropdown">
              <div
                className="easy-editor-dropdown-menu__content"
                style={{
                  maxHeight: CODE_BLOCK_DROPDOWN_MAX_HEIGHT,
                }}
              >
                <div className="easy-editor-code-block__dropdown-search">
                  <div className="easy-editor-code-block__dropdown-input">
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
                <div className="easy-editor-code-block__dropdown-list">
                  {searchedLanguages.map(lang => (
                    <div
                      key={lang.value}
                      className={classNames('easy-editor-dropdown-menu__item', {
                        'easy-editor-dropdown-menu__item--active':
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
              className="easy-editor-dropdown-trigger easy-editor-code-block__dropdown-trigger"
              onClick={handleOpen}
            >
              <span>{selectedLanguageItem?.name || selectedValue}</span>
            </div>
          ) : (
            <span>{languageItem?.name || language}</span>
          )}
        </Dropdown>
        <div className="easy-editor-code-block__button_area">
          <button
            className="easy-editor-code-block__button_area__button"
            onClick={async () => {
              try {
                focusToCodeBlock();
                const formatCodeString = await formatCode(
                  pureCode,
                  selectedValue,
                );
                const range = getCurrentCodeBlockRange();
                if (range) {
                  const { from, to } = range;
                  const newNode = editor.schema.nodes[BLOCK_TYPES.CODE].create(
                    { language: selectedValue }, // attrs
                    editor.schema.text(formatCodeString), // content
                  );
                  const tr = editor.state.tr.replaceWith(from - 1, to, newNode);
                  tr.setSelection(TextSelection.create(tr.doc, from + 1)); // 设置光标位置
                  editor.view.dispatch(tr);
                } else {
                  message.warning('操作失败');
                }
              } catch (e) {
                message.warning('操作失败');
              }
            }}
          >
            格式化
          </button>
          <button
            className="easy-editor-code-block__button_area__button"
            onClick={() => {
              copy(pureCode as string);
              message.success('复制成功');
            }}
          >
            复制
          </button>
          <button
            className="easy-editor-code-block__button_area__button"
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
            className="easy-editor-code-block__button_area__button"
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
        </div>
      </div>
      <div className="easy-editor-code-block__content-wrapper">
        <div className="easy-editor-code-block__line-numbers">
          {lineNumbers.map(num => (
            <div key={num} className="easy-editor-code-block__line-numbers-row">
              {num}
            </div>
          ))}
        </div>
        <div className="easy-editor-code-block__content">
          <pre className={classNames('hljs')} ref={$container}>
            <NodeViewContent as="div" />
          </pre>
        </div>
      </div>
    </NodeViewWrapper>
  );
};
