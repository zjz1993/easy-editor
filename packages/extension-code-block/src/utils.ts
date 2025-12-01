import type {Node} from '@tiptap/pm/model';
import type {Selection} from '@tiptap/pm/state';

export function getSelectedLineRange(
  selection: Selection,
  codeBlockNode: Node,
) {
  const { $from, from, to } = selection;
  const text = codeBlockNode.textContent || '';
  const lines = text.split('\n');
  const lineLastIndexMap = lines.reduce(
    (acc, line, index) => {
      acc[index] = (acc[index - 1] || 0) + line.length + (index === 0 ? 0 : 1);
      return acc;
    },
    {} as { [key: number]: number },
  );
  const selectedTextStart = $from.parentOffset;
  const selectedTextEnd = $from.parentOffset + to - from;
  const lineKeys = Object.keys(lineLastIndexMap) as unknown as number[];
  const selectedLineStart: number | undefined = lineKeys.find(
    index => lineLastIndexMap[index] >= selectedTextStart,
  );
  const selectedLineEnd: number | undefined = lineKeys.find(
    index => lineLastIndexMap[index] >= selectedTextEnd,
  );
  return {
    start: selectedLineStart,
    end: selectedLineEnd,
  };
}

export function exportCode(code: string, language: string) {
  // 1. 根据语言映射文件后缀
  const extMap: Record<string, string> = {
    javascript: 'js',
    js: 'js',
    typescript: 'ts',
    ts: 'ts',
    python: 'py',
    html: 'html',
    css: 'css',
    scss: 'scss',
    sql: 'sql',
    java: 'java',
    c: 'c',
    cpp: 'cpp',
    rust: 'rs',
    // 可以根据需求继续扩展
  };

  const ext = extMap[language] || 'txt';
  const fileName = `code-block.${ext}`;

  // 2. 创建 Blob
  const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });

  // 3. 创建临时 <a> 标签下载
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  document.body.appendChild(link);
  link.click();

  // 4. 释放 URL
  URL.revokeObjectURL(link.href);
  document.body.removeChild(link);
}
