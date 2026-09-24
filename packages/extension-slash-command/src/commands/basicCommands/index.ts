import type {SlashItem} from "../../SlashCommand";

export const basicCommands: SlashItem[] = [
  {
    id: 'paragraph',
    title: 'Text',
    description: '普通文本',
    keywords: ['text', 'paragraph', 'p'],

    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setParagraph()
        .run()
    },
  },

  {
    id: 'heading-1',
    title: 'Heading 1',
    description: '一级标题',
    keywords: ['h1', 'title'],

    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setHeading({
          level: 1,
        })
        .run()
    },
  },
]
export default basicCommands;
