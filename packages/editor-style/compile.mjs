import path, {dirname} from 'node:path';
import fs from 'fs-extra';
import * as sass from 'sass'
import {fileURLToPath} from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SRC_DIR = path.join(__dirname, 'src');
const DIST_DIR = path.join(__dirname, 'dist');

function getScssFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(getScssFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.scss')) {
      files.push(fullPath);
    }
  }

  return files;
}

// 编译 SCSS 文件
function compileScssFiles() {
  // 确保 dist 目录存在
  fs.ensureDirSync(DIST_DIR);

  // 获取所有 .scss 文件
  const scssFiles = getScssFiles(SRC_DIR);
  console.log('scssFiles是',scssFiles);
  scssFiles.forEach(file => {
    const relativePath = path.relative(SRC_DIR, file);
    const outFile = path.join(
      DIST_DIR,
      relativePath.replace(/\.scss$/, '.css'),
    );

    try {
      // 编译 SCSS 文件
      const result = sass.compile(file);

      // 确保输出目录存在
      fs.ensureDirSync(path.dirname(outFile));

      // 写入编译后的 CSS
      fs.writeFileSync(outFile, result.css);

      console.log(`Compiled: ${file} -> ${outFile}`);
    } catch (error) {
      console.error(`Error compiling ${file}:`, error.message);
    }
  });
}

// 运行脚本
compileScssFiles();
