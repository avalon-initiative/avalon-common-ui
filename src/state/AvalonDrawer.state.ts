// Behavior for AvalonDrawer, kept out of the .vue file per the glue-only-script convention:
// Escape closes while open, focus moves into the panel on open and returns to the opener on close.
import { nextTick, onScopeDispose, watch } from 'vue'
import type { Ref } from 'vue'

export function useDrawerBehavior(
  open: () => boolean,
  panel: Ref<HTMLElement | null>,
  close: () => void,
  doc: Document = document,
) {
  let opener: HTMLElement | null = null

  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && !e.defaultPrevented) close()
  }

  watch(
    open,
    async (isOpen) => {
      if (isOpen) {
        opener = doc.activeElement instanceof HTMLElement ? doc.activeElement : null
        doc.addEventListener('keydown', onKey)
        await nextTick()
        panel.value?.focus({ preventScroll: true })
      } else {
        doc.removeEventListener('keydown', onKey)
        if (opener?.isConnected) opener.focus({ preventScroll: true })
        opener = null
      }
    },
    { immediate: true },
  )

  onScopeDispose(() => doc.removeEventListener('keydown', onKey))
}
