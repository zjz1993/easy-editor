import {type FC, useState} from "react";
import type {SuggestionProps} from "@tiptap/suggestion";
import type {SlashItem} from "./SlashCommand";

interface SlashMenuRef {
  onKeyDown: (props: {
    event: KeyboardEvent
  }) => boolean
}

export type SlashMenuProps = SuggestionProps<SlashItem>


const SlashMenu: FC<SlashMenuProps> = (props) => {
  console.log('props是', props);
  const {items} = props;
  const [selectedIndex, setSelectedIndex] = useState(undefined);
  const selectItem = (index: number) => {
    const item = items[index]

    if (!item) {
      return
    }

    props.command(item)
  }
  if (!Array.isArray(items)){
    return null;
  }
  if (items.length === 0){
    return (
      <div className="textory-slash-menu">
        <div>没找到</div>
      </div>
    )
  }
  return (
    <div className="textory-slash-menu">
      {
        items.map((item, index) => {
          const active = index === selectedIndex

          return (
            <button
              key={item.id}
              type="button"
              className={`textory-slash-menu-item ${
                active ? 'is-active' : ''
              }`}
              onMouseEnter={(event) => {
                setSelectedIndex(index);
              }}
              onMouseDown={(event) => {
                event.preventDefault()
                selectItem(index)
              }}
            >
              <div className="textory-slash-menu-item-title">
                {item.title}
              </div>

              <div className="slash-menu-item-description">
                {item.description}
              </div>
            </button>
          )
        })
      }
    </div>
  )
}
export {SlashMenu, type SlashMenuRef};
