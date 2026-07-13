import '@textory/styles/src/index.scss';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import IntroPage from './pages/IntroPage';
import PlaygroundPage from './pages/PlaygroundPage';
import DocsPage from './pages/DocsPage';
import NotFoundPage from './pages/NotFoundPage';
import { DEFAULT_DOC_SLUG } from './utils/docsGraph';

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<IntroPage />} />
        <Route path="/playground" element={<PlaygroundPage />} />
        <Route
          path="/docs"
          element={<Navigate to={DEFAULT_DOC_SLUG} replace />}
        />
        <Route path="/docs/*" element={<DocsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
