export interface AvalonMultiSelectOption {
  value: string
  /** What the list shows; an app may shorten a long value here. */
  label: string
  /** The full value, shown as a tooltip when `label` is shortened. */
  title?: string
  /** Secondary line under the label. */
  description?: string
}

export interface AvalonMultiSelectProps {
  options: AvalonMultiSelectOption[]
  /** Selected option values (v-model). */
  modelValue: string[]
  /** Trigger text, e.g. "Role"; a selected count is appended. */
  label: string
  searchPlaceholder?: string
  /** Show the search box (default true). */
  searchable?: boolean
  /** Shown when the search matches nothing. */
  emptyText?: string
  /** Text of the button that unticks everything. */
  clearLabel?: string
}
