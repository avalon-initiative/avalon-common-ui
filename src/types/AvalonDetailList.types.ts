export interface AvalonDetailListItem {
  label: string
  value: string
  /** Render the value in the mono font (URLs, keys, hashes, durations). */
  mono?: boolean
  /** Show the value as a wrapped, line-preserving mono block on its own row under the label. */
  block?: boolean
}

export interface AvalonDetailListProps {
  items: AvalonDetailListItem[]
  title?: string
}
