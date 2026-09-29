export type AvalonLegendTone =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'muted'

// 'dot' marks a node-like item; the line shapes mark a link-like item.
export type AvalonLegendShape = 'dot' | 'solid' | 'dashed' | 'dotted'

export interface AvalonLegendItem {
  /** Stable key and hook for the glyph slot; falls back to the label. */
  id?: string
  label: string
  /** Defaults to 'primary'. */
  tone?: AvalonLegendTone
  /** Defaults to 'dot'. */
  shape?: AvalonLegendShape
}

export interface AvalonLegendGroup {
  title?: string
  items: AvalonLegendItem[]
}

export interface AvalonLegendProps {
  groups: AvalonLegendGroup[]
  /** Accessible name of the legend section. */
  label?: string
  /** Most columns when wide; each is still at least 11rem. Defaults to auto (up to 3). */
  columns?: 1 | 2 | 3
}
