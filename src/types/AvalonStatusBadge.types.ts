export type AvalonStatusTone = 'success' | 'warning' | 'danger' | 'neutral'

// A small dot-and-label status. The caller maps its own state onto a tone
// and a label, so the badge knows nothing about what is being reported.
export interface AvalonStatusBadgeProps {
  label: string
  /** Defaults to 'neutral'. */
  tone?: AvalonStatusTone
}
