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
}
