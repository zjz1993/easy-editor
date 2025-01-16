import { Plugin } from '@tiptap/pm/state';
const PastePlugin = () => {
  return new Plugin({
    props: {
      handlePaste: function (view, event, slice) {
        const text = event.clipboardData?.getData('text/plain');
        console.log('handlePaste触发', view);
        if (text) {
          const urlRegex = /(https?:\/\/[^\s]+)/g;
          let match;

          while ((match = urlRegex.exec(text)) !== null) {
            const [url] = match;
            // 自定义转换逻辑，例如将 URL 转换为 CustomLink 节点
            view.dispatch(
              view.state.tr.replaceSelectionWith(
                view.state.schema.nodes.custom_link.create({
                  href: url,
                  text: url,
                }),
              ),
            );
            return true;
          }
        }
        return false; // 返回 false 表示继续处理粘贴
      },
    },
  });
};
export default PastePlugin;
