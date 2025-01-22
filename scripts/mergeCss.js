const fs = require('fs');
const path = require('path');

// 获取 packages 目录路径
const packagesDir = path.resolve(__dirname, '../packages');

// 目标包和输出文件路径
const targetPackage = 'editor-main';
const targetCssPath = path.join(packagesDir, targetPackage, 'dist', 'styles.css');

// 遍历目录并合并文件
function mergeStyles() {
  const packages = fs.readdirSync(packagesDir).filter((pkg) => {
    const pkgPath = path.join(packagesDir, pkg);
    return fs.statSync(pkgPath).isDirectory();
  });

  let mergedContent = '';

  packages.forEach((pkg) => {
    const cssFilePath = path.join(packagesDir, pkg, 'dist', 'styles.css');

    if (fs.existsSync(cssFilePath)) {
      const content = fs.readFileSync(cssFilePath, 'utf-8');
      mergedContent += `/* ${pkg}/dist/styles.css */\n` + content + '\n';
    }
  });

  // 确保目标文件夹存在
  const targetDistDir = path.dirname(targetCssPath);
  if (!fs.existsSync(targetDistDir)) {
    fs.mkdirSync(targetDistDir, { recursive: true });
  }

  // 写入合并内容到目标文件
  fs.writeFileSync(targetCssPath, mergedContent, 'utf-8');
  console.log(`All styles merged into ${targetCssPath}`);
}

// 执行脚本
mergeStyles();
