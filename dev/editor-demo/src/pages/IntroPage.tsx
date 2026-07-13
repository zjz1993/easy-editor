import { type EditorRef } from '@textory/editor';
import { useRef } from 'react';
import '../styles/intro.scss';
import Nav from '../sections/Nav';
import Hero from '../sections/Hero';
import Features from '../sections/Features';
import EditorDemo from '../sections/EditorDemo';
import QuickStart from '../sections/QuickStart';
import Highlights from '../sections/Highlights';

function IntroPage() {
  const editorRef = useRef<EditorRef>(null);

  const scrollTodemo = () => {
    document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="intro-page">
      <Nav onTryClick={scrollTodemo} />
      <Hero onPrimaryClick={scrollTodemo} />
      <Features />
      <EditorDemo editorRef={editorRef} />
      <QuickStart />
      <Highlights />
      <footer className="intro-footer">
        <p>
          Textory · 基于 <a href="#architecture">Tiptap</a> 的模块化富文本编辑器 ·
          TypeScript + pnpm workspaces
        </p>
      </footer>
    </div>
  );
}

export default IntroPage;
