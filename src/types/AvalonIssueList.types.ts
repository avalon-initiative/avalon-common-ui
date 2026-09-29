export type AvalonIssueTone = 'warning' | 'danger'

export interface AvalonIssueListItem {
  id: string
  /** Short text label of the kind of issue; the tone only reinforces it. */
  badge: string
  tone: AvalonIssueTone
  primary: string
  secondary?: string
  /** Tooltip. */
  title?: string
}

// A titled list of problems. Renders nothing when there are none.
export interface AvalonIssueListProps {
  /** Heading; the item count is appended, for example "Alerts (3)". */
  title?: string
  items: AvalonIssueListItem[]
  /** When true the primary line is a button that emits `select`. */
  selectable?: boolean
  /** Accessible name of the section. */
  label?: string
}
