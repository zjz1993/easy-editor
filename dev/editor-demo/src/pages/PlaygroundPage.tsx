import Editor from '@textory/editor';
import {
  LiveProvider,
  LiveEditor,
  LivePreview,
  LiveError,
} from 'react-live';
import { themes } from 'prism-react-renderer';
import {Link, useNavigate} from 'react-router-dom';
import * as React from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { FC, PointerEvent as ReactPointerEvent } from 'react';
import {
  PLAYGROUND_EXAMPLES,
  DEFAULT_EXAMPLE_ID,
  type PlaygroundExample,
} from '../data/playgroundExamples';
import { DEMO_HTML } from '../data/demoContent';
import '../styles/playground.scss';

const PlaygroundPage: FC = () => {
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState<string>(DEFAULT_EXAMPLE_ID);
  const currentExample = useMemo<PlaygroundExample>(
    () =>
      PLAYGROUND_EXAMPLES.find((e) => e.id === selectedId) ??
      PLAYGROUND_EXAMPLES[0],
    [selectedId],
  );

  const [code, setCode] = useState<string>(currentExample.code);
  const [committedCode, setCommittedCode] = useState<string>(currentExample.code);
  const [autoRun, setAutoRun] = useState<boolean>(false);
  const [ratio, setRatio] = useState<number>(0.5);
  const [dragging, setDragging] = useState<boolean>(false);
  const [fullscreen, setFullscreen] = useState<boolean>(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  // 切换示例时重置 code 和 committedCode
  useEffect(() => {
    setCode(currentExample.code);
    setCommittedCode(currentExample.code);
  }, [currentExample]);

  // 自动运行模式：每次 code 变化同步到 committedCode
  useEffect(() => {
    if (autoRun) setCommittedCode(code);
  }, [code, autoRun]);

  const isDirty = code !== committedCode;

  const handleRun = useCallback(() => {
    setCommittedCode(code);
  }, [code]);

  const handleReset = useCallback(() => {
    setCode(currentExample.code);
    setCommittedCode(currentExample.code);
  }, [currentExample]);

  // Cmd/Ctrl + Enter 触发运行
  useEffect(() => {
    if (autoRun) return;
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        setCommittedCode((curCommitted) =>
          curCommitted === code ? curCommitted : code,
        );
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [autoRun, code]);

  // 拖拽分隔条
  const handlePointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const handlePointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragging || !bodyRef.current) return;
    const rect = bodyRef.current.getBoundingClientRect();
    const isMobile = rect.width <= 768;
    const r = isMobile
      ? (e.clientY - rect.top) / rect.height
      : (e.clientX - rect.left) / rect.width;
    setRatio(Math.min(0.85, Math.max(0.15, r)));
  };
  const handlePointerUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    setDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  const toggleFullscreen = () => setFullscreen((v) => !v);

  const scope = useMemo(
    () => ({
      Editor,
      React,
      useState,
      useRef,
      useEffect,
      useMemo,
      useCallback,
      DEMO_HTML,
    }),
    [],
  );

  return (
    <LiveProvider
      code={committedCode}
      scope={scope}
      theme={themes.vsDark}
      noInline
    >
      <div className="playground-page">
        <header className="playground-header">
          <div className="playground-header__left">
            <Link className="playground-header__brand" to="/">
              <span className="playground-header__logo">EE</span>
              <span>Textory</span>
            </Link>
            <span className="playground-header__title">演练场</span>
          </div>
          <div className="playground-header__right">
            <button
              className="playground-header__btn playground-header__btn--primary"
              onClick={() => navigate('/')}
            >
              回首页
            </button>
            <select
              className="playground-header__select"
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              aria-label="选择示例"
            >
              {PLAYGROUND_EXAMPLES.map((ex) => (
                <option key={ex.id} value={ex.id}>
                  {ex.label}
                </option>
              ))}
            </select>
            <label className="playground-header__toggle" title="开启后每次输入都会即时刷新预览">
              <input
                type="checkbox"
                checked={autoRun}
                onChange={(e) => setAutoRun(e.target.checked)}
              />
              <span>自动运行</span>
            </label>
            <button
              className={
                'playground-header__btn playground-header__btn--run' +
                (isDirty && !autoRun ? ' playground-header__btn--dirty' : '')
              }
              onClick={handleRun}
              disabled={autoRun || !isDirty}
              title="快捷键：Cmd / Ctrl + Enter"
            >
              运行
            </button>
            <button
              className="playground-header__btn"
              onClick={toggleFullscreen}
            >
              {fullscreen ? '显示代码' : '隐藏代码'}
            </button>
            <button
              className="playground-header__btn playground-header__btn--primary"
              onClick={handleReset}
            >
              重置
            </button>
          </div>
        </header>

        <div className="playground-body" ref={bodyRef}>
          {!fullscreen && (
            <>
              <div
                className="playground-pane playground-pane--code"
                style={{ flex: ratio }}
              >
                <div className="playground-pane__head">
                  <span>
                    {currentExample.label} · {currentExample.description}
                  </span>
                </div>
                <div className="playground-pane__body">
                  <LiveEditor
                    className="playground-editor"
                    onChange={setCode}
                  />
                </div>
              </div>
              <div
                className={
                  'playground-divider' +
                  (dragging ? ' playground-divider--dragging' : '')
                }
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
              />
            </>
          )}
          <div
            className="playground-pane playground-pane--preview"
            style={{ flex: fullscreen ? 1 : 1 - ratio }}
          >
            <div className="playground-pane__head">
              <span>预览</span>
            </div>
            <div className="playground-pane__body">
              <LivePreview className="playground-preview-inner" />
            </div>
          </div>
        </div>

        <LiveError className="playground-error" />
      </div>
    </LiveProvider>
  );
};

export default PlaygroundPage;
