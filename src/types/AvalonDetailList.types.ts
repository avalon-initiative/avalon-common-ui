export interface AvalonDetailListItem {
  label: string
  value: string
  /** Render the value in the mono font (URLs, keys, hashes, durations). */
  mono?: boolean
}

export interface AvalonDetailListProps {
  items: AvalonDetailListItem[]
  title?: string
}
