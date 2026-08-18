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

// 叶子子路径：editor-utils/constants 只含纯常量，避免主入口的
// editor-common-ui iconfont 副作用在测试环境崩溃
alias.push({
  find: /^@textory\/editor-utils\/constants$/,
  replacement: path.resolve(__dirname, 'packages/editor-utils/src/constants.ts'),
});
// iconfont 副作用脚本在 happy-dom 下崩溃，统一替换为空 stub
//（样式渲染不受影响，仅跳过 SVG sprite 注入；alias 按导入说明符
// './iconfont.js' 匹配，故不能带目录前缀）
alias.push({
  find: /(^|\/)iconfont\.js$/,
  replacement: path.resolve(__dirname, 'test/stubs/iconfont.js'),
});

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
