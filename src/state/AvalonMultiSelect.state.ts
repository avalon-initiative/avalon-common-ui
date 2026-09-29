// Filtering, toggling and popover behavior for AvalonMultiSelect, kept out of
// the .vue file per this package's glue-only-script convention.
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import type { AvalonMultiSelectOption } from '../types/AvalonMultiSelect.types'

/** Case-insensitive match on label and value; a blank query keeps everything. */
export function filterOptions(
  options: AvalonMultiSelectOption[],
  query: string,
): AvalonMultiSelectOption[] {
  const needle = query.trim().toLowerCase()
  if (!needle) return options
  return options.filter(
    (o) => o.label.toLowerCase().includes(needle) || o.value.toLowerCase().includes(needle),
  )
}

/** Returns a new list with `value` added, or removed when already present. */
export function toggleValue(selected: string[], value: string): string[] {
  return selected.includes(value) ? selected.filter((v) => v !== value) : [...selected, value]
}

const VIEWPORT_GUTTER = 16

export function clear(): string[] {
  return []
}

export type AvalonMultiSelectAlign = 'start' | 'end' | 'auto'

export interface RectEdges {
  left: number
  right: number
}

/** Start-aligned when it fits; otherwise end-aligned if the trigger sits nearer the right edge (clampShift then handles a popover too wide for either). */
export function alignFor(
  trigger: RectEdges,
  popoverWidth: number,
  viewportWidth: number,
  gutter: number,
): 'start' | 'end' {
  if (trigger.left + popoverWidth <= viewportWidth - gutter) return 'start'
  return trigger.left + trigger.right >= viewportWidth ? 'end' : 'start'
}

/** Horizontal px shift that keeps an aligned popover inside the viewport gutters. */
export function clampShift(
  trigger: RectEdges,
  popoverWidth: number,
  align: 'start' | 'end',
  viewportWidth: number,
  gutter: number,
): number {
  const left = align === 'start' ? trigger.left : trigger.right - popoverWidth
  const maxLeft = viewportWidth - gutter - popoverWidth
  const clamped = Math.max(gutter, Math.min(left, maxLeft))
  return Math.round(clamped - left)
}

export interface MultiSelectEmit {
  (event: 'update:modelValue', value: string[]): void
}

export function useMultiSelect(
  getOptions: () => AvalonMultiSelectOption[],
  getSelected: () => string[],
  getSearchable: () => boolean,
  getAlign: () => AvalonMultiSelectAlign,
  emit: MultiSelectEmit,
) {
  const open = ref(false)
  const query = ref('')
  const root = ref<HTMLElement | null>(null)
  const trigger = ref<HTMLButtonElement | null>(null)
  const search = ref<HTMLInputElement | null>(null)
  const list = ref<HTMLElement | null>(null)

  const resolvedAlign = ref<'start' | 'end'>('start')
  const shift = ref(0)
  const popover = ref<HTMLElement | null>(null)

  // Measured after the popover is displayed; runs before paint so there is no flash.
  function place() {
    const t = trigger.value
    const p = popover.value
    if (!t || !p) return
    const rect = t.getBoundingClientRect()
    const width = p.offsetWidth
    const viewport = document.documentElement.clientWidth
    const forced = getAlign()
    resolvedAlign.value = forced === 'auto' ? alignFor(rect, width, viewport, VIEWPORT_GUTTER) : forced
    shift.value = clampShift(rect, width, resolvedAlign.value, viewport, VIEWPORT_GUTTER)
  }

  const visible = computed(() => filterOptions(getOptions(), query.value))
  const count = computed(() => getSelected().length)

  function checkboxes(): HTMLInputElement[] {
    return Array.from(list.value?.querySelectorAll<HTMLInputElement>('input[type="checkbox"]') ?? [])
  }

  async function openPopover() {
    open.value = true
    await nextTick()
    place()
    if (getSearchable()) search.value?.focus()
    else checkboxes()[0]?.focus()
  }

  function close(refocus: boolean) {
    if (!open.value) return
    open.value = false
    query.value = ''
    if (refocus) trigger.value?.focus()
  }

  function toggleOpen() {
    if (open.value) close(false)
    else void openPopover()
  }

  function toggle(value: string) {
    emit('update:modelValue', toggleValue(getSelected(), value))
  }

  function clearAll() {
    emit('update:modelValue', clear())
  }

  function onKeydown(e: KeyboardEvent) {
    if (!open.value) return
    if (e.key === 'Escape') {
      e.preventDefault()
      e.stopPropagation()
      close(true)
      return
    }
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return
    const boxes = checkboxes()
    const at = boxes.indexOf(document.activeElement as HTMLInputElement)
    if (e.key === 'ArrowDown' && (at >= 0 || document.activeElement === search.value)) {
      e.preventDefault()
      boxes[at + 1]?.focus()
    } else if (e.key === 'ArrowUp' && at >= 0) {
      e.preventDefault()
      if (at === 0 && getSearchable()) search.value?.focus()
      else boxes[at - 1]?.focus()
    }
  }

  function onDocumentPointerDown(e: MouseEvent) {
    if (open.value && root.value && !root.value.contains(e.target as Node)) close(false)
  }

  // Tabbing out of the popover closes it without stealing focus back.
  function onFocusOut(e: FocusEvent) {
    const next = e.relatedTarget as Node | null
    if (open.value && next && root.value && !root.value.contains(next)) close(false)
  }

  onMounted(() => document.addEventListener('mousedown', onDocumentPointerDown))
  onBeforeUnmount(() => document.removeEventListener('mousedown', onDocumentPointerDown))

  return {
    open,
    query,
    root,
    trigger,
    search,
    list,
    popover,
    resolvedAlign,
    shift,
    visible,
    count,
    toggleOpen,
    toggle,
    clearAll,
    onKeydown,
    onFocusOut,
  }
}
