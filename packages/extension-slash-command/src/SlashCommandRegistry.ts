import type {Editor} from "@tiptap/core";
import type {SlashItem} from "./SlashCommand";

export class SlashCommandRegistry {
  private items: SlashItem[] = []

  register(item: SlashItem) {
    this.items.push(item)

    return this
  }

  registerMany(items: SlashItem[]) {
    this.items.push(...items)

    return this
  }

  getAll(context: { editor: Editor }) {
    return this.items.filter((item) => {
      return item.visible?.(context) ?? true
    })
  }

  search(
    query: string,
    context: { editor: Editor },
  ) {
    const items = this.getAll(context)

    if (!query) {
      return items
    }

    const keyword = query.toLowerCase()

    return items.filter((item) => {
      if (item.title.toLowerCase().includes(keyword)) {
        return true
      }

      return item.keywords?.some((keyword) =>
        keyword.toLowerCase().includes(query.toLowerCase()),
      )
    })
  }
}
