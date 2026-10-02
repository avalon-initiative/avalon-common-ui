export interface AvalonSelectOption {
  value: string
  /** What the list and the trigger show. */
  label: string
  /** Secondary line under the label. */
  description?: string
  /** Full value shown as a tooltip when `label` is shortened. */
  title?: string
}

export interface AvalonSelectProps {
  options: AvalonSelectOption[]
  /** The chosen option's value (v-model); an empty string means none. */
  modelValue: string
  /** Accessible name and the small caption above the trigger. */
  label: string
  /** Trigger text while nothing is chosen. */
  placeholder?: string
  searchPlaceholder?: string
  /** Shown when the filter matches nothing. */
  emptyText?: string
  disabled?: boolean
  /** Popover edge aligned to the trigger; 'auto' (default) keeps it on screen. */
  align?: 'start' | 'end' | 'auto'
  /** CSS length of the popover width (default 20rem); still capped to the viewport. */
  width?: string
}
