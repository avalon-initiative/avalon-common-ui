export interface AvalonTab {
  id: string
  label: string
  // Short text beside the label (a count or state); text so it never relies on colour.
  badge?: string
  disabled?: boolean
}

export interface AvalonTabsProps {
  tabs: AvalonTab[]
  // aria-label of the tablist.
  label?: string
  // Keep every panel mounted (hidden with v-show) so state inside survives; false renders only the active one.
  keepAlive?: boolean
  // 'lg' raises the label size and padding for a primary navigation strip.
  size?: 'md' | 'lg'
}
