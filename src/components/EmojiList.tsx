import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react'

type EmojiItem = {
  name: string
  emoji: string
  fallbackImage?: string
}

type EmojiListProps = {
  items: EmojiItem[]
  command: (item: { name: string }) => void
}

export type EmojiListRef = {
  onKeyDown: (x: { event: KeyboardEvent }) => boolean
}

export const EmojiList = forwardRef<EmojiListRef, EmojiListProps>((props, ref) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(0)

  const selectItem = (index: number) => {
    const item = props.items[index]
    if (item) props.command({ name: item.name })
  }

  const upHandler = () =>
    setSelectedIndex((selectedIndex + props.items.length - 1) % props.items.length)
  const downHandler = () =>
    setSelectedIndex((selectedIndex + 1) % props.items.length)
  const enterHandler = () => selectItem(selectedIndex)

  useEffect(() => setSelectedIndex(0), [props.items])

  useImperativeHandle(
    ref,
    () => ({
      onKeyDown: ({ event }: { event: KeyboardEvent }) => {
        if (event.key === 'ArrowUp') {
          upHandler()
          return true
        }
        if (event.key === 'ArrowDown') {
          downHandler()
          return true
        }
        if (event.key === 'Enter') {
          enterHandler()
          return true
        }
        if (event.key === 'Tab') {
          event.preventDefault()
          if (props.items.length > 0) selectItem(0)
          return true
        }
        return false
      },
    }),
    [upHandler, downHandler, enterHandler, props.items]
  )

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow flex flex-col gap-1 overflow-auto p-1 relative">
      {props.items.map((item, index) => (
        <button
          key={index}
          onClick={() => selectItem(index)}
          className={`flex items-center gap-1 w-full text-left p-1 rounded cursor-pointer
            ${index === 0 ? 'bg-gray-300' : ''}
            hover:bg-gray-300`}
        >
          {item.fallbackImage ? <img src={item.fallbackImage} className="w-4 h-4" alt="" /> : item.emoji}
          {" "} {item.name}
        </button>
      ))}
    </div>
  )
})