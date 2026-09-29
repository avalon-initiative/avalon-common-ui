export interface AvalonToggleSwitchProps {
  modelValue: boolean
  label: string
  description?: string
  disabled?: boolean
  /** Show the visible On/Off text (default true); when false it stays available to assistive tech. */
  showState?: boolean
  /** Tooltip on the control. */
  title?: string
  /** Tighter layout for toolbars: smaller track, one-line description. */
  compact?: boolean
}
