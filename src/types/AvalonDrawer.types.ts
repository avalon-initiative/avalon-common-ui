export interface AvalonDrawerProps {
  open: boolean
  title: string
  // Accessible name for the close button.
  closeLabel?: string
  // No slide animation when true (the CSS also honours prefers-reduced-motion).
  reducedMotion?: boolean
  // aria-label of the complementary region; falls back to the title.
  label?: string
}
