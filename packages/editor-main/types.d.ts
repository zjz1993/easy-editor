/// <reference types="vite/client" />
declare module '*.scss' {
  const content: { [className: string]: string };
  export default content;
}

// ... existing code ...
interface ImportMetaEnv {
  MODE?: string;
  [key: string]: string | undefined;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
// ... existing code ...
