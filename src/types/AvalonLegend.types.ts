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

export interface AvalonLegendProps {
  items: AvalonLegendItem[]
  title?: string
}
