export interface AvalonChipListItem {
  id: string
  label: string
  /** Tooltip with the full text when `label` is shortened. */
  title?: string
  /** Show the remove button (default true). */
  removable?: boolean
}

export interface AvalonChipListProps {
  items: AvalonChipListItem[]
  /** Accessible name of the list. */
  label?: string
}
