// 编辑器示例文档内容，展示主要富文本能力
export const DEMO_HTML = `
<h1>Textory · 开箱即用的富文本编辑器</h1>
<p>基于 <strong>Tiptap</strong> 构建的模块化编辑器，采用 TypeScript + pnpm workspaces 的 monorepo 架构。每个功能都是独立扩展包，可按需组合。</p>
<h2>核心特性</h2>
<ul>
  <li><strong>模块化扩展</strong>：加粗、图片、表格、代码块、任务列表等均为独立包</li>
  <li><strong>实时大纲</strong>：自动根据标题生成可点击导航</li>
  <li><strong>导出 Word</strong>：一键导出 DOCX，支持自定义水印</li>
  <li><strong>图片上传</strong>：支持自定义上传通道与大小限制</li>
</ul>
<h2>任务清单</h2>
<ul data-type="taskList">
  <li data-type="taskItem" data-checked="true"><div><p>搭建编辑器骨架</p></div></li>
  <li data-type="taskItem" data-checked="true"><div><p>接入工具栏与扩展</p></div></li>
  <li data-type="taskItem" data-checked="false"><div><p>发布 1.0 正式版</p></div></li>
</ul>
<h2>代码高亮</h2>
<pre><code class="language-typescript">import Editor from '@textory/editor';

function App() {
  return (
    &lt;Editor
      placeholder="开始书写..."
      onChange={(html) => console.log(html)}
    /&gt;
  );
}</code></pre>
<h2>表格示例</h2>
<table>
  <tbody>
    <tr><th>扩展</th><th>能力</th><th>状态</th></tr>
    <tr><td>Table</td><td>可调整列宽、合并单元格</td><td>已内置</td></tr>
    <tr><td>Image</td><td>上传、预览、缩放</td><td>已内置</td></tr>
    <tr><td>Outline</td><td>大纲导航</td><td>已内置</td></tr>
  </tbody>
</table>
<blockquote><p>专注内容，让编辑器替你处理格式。</p></blockquote>
`;
