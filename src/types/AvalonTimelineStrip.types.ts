export type AvalonTimelineTone = 'neutral' | 'success' | 'danger' | 'warning'

export interface AvalonTimelineItem {
  id: string
  /** Big figure on the card. Defaults to the 1-based position. */
  number?: string | number
  subtitle?: string
  /** What changed, in words; the tone alone never carries the meaning. */
  note?: string
  /** Small uppercase marker, for example "latest". */
  tag?: string
  /** Defaults to 'neutral'. */
  tone?: AvalonTimelineTone
  /** Tooltip. */
  title?: string
  ariaLabel?: string
}

// A wrapping strip of numbered snapshot cards; the caller owns what each one means.
export interface AvalonTimelineStripProps {
  items: AvalonTimelineItem[]
  /** Id of the highlighted item. */
  current?: string
  /** Accessible name of the list. */
  label?: string
}
