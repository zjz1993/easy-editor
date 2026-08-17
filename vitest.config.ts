import path from 'node:path';
import { defineConfig } from 'vitest/config';

// 将 @textory/* 内部包解析到源码，测试无需先 build
const packageDirs: Record<string, string> = {
  editor: 'editor-main',
  context: 'editor-context',
  styles: 'editor-style',
  'editor-common': 'editor-common',
  'editor-common-ui': 'editor-common-ui',
  'editor-toolbar': 'editor-toolbar',
  'editor-utils': 'editor-utils',
};

const alias = Object.entries(packageDirs).map(([name, dir]) => ({
  find: new RegExp(`^@textory/${name}$`),
  replacement: path.resolve(__dirname, `packages/${dir}/src/index.ts`),
}));

export default defineConfig({
  resolve: { alias },
  test: {
    environment: 'happy-dom',
    include: ['packages/*/src/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['packages/*/src/**/*.{ts,tsx}'],
      exclude: [
        '**/*.d.ts',
        '**/index.ts',
        '**/*.scss',
        '**/*.test.{ts,tsx}',
      ],
      // 立刻强制：存量测试补齐前 pnpm test:coverage 会失败，属预期倒逼机制
      thresholds: {
        statements: 80,
        branches: 80,
        functions: 80,
        lines: 80,
      },
    },
  },
});
