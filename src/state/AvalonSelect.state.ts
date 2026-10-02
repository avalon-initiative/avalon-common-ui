// Filtering, keyboard and popover behavior for AvalonSelect, kept out of the .vue file per this package's glue-only-script convention.
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { AvalonSelectOption } from '../types/AvalonSelect.types'
import { alignFor, clampShift, filterOptions } from './AvalonMultiSelect.state'

const VIEWPORT_GUTTER = 16

export { filterOptions }

/** The next active row for an arrow key, clamped to the list; -1 when there is nothing to move to. */
export function moveActive(active: number, key: 'ArrowDown' | 'ArrowUp', length: number): number {
  if (length === 0) return -1
  if (active < 0) return key === 'ArrowDown' ? 0 : length - 1
  return Math.max(0, Math.min(length - 1, active + (key === 'ArrowDown' ? 1 : -1)))
}

export interface SelectEmit {
  (event: 'update:modelValue', value: string): void
}

export function useSelect(
  getOptions: () => AvalonSelectOption[],
  getValue: () => string,
  getAlign: () => 'start' | 'end' | 'auto',
  emit: SelectEmit,
) {
  const open = ref(false)
  const query = ref('')
  const active = ref(-1)
  const root = ref<HTMLElement | null>(null)
  const trigger = ref<HTMLButtonElement | null>(null)
  const search = ref<HTMLInputElement | null>(null)
  const list = ref<HTMLElement | null>(null)
  const popover = ref<HTMLElement | null>(null)
  const resolvedAlign = ref<'start' | 'end'>('start')
  const shift = ref(0)

  const visible = computed(() => filterOptions(getOptions(), query.value))
  const selected = computed(() => getOptions().find((o) => o.value === getValue()) ?? null)

  // The first match is the active row as the filter changes.
  watch(query, () => (active.value = visible.value.length ? 0 : -1))

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

  function scrollActiveIntoView() {
    list.value?.querySelector<HTMLElement>('[aria-selected][data-active="true"]')?.scrollIntoView?.({ block: 'nearest' })
  }

  async function openPopover() {
    open.value = true
    active.value = Math.max(0, visible.value.findIndex((o) => o.value === getValue()))
    await nextTick()
    place()
    search.value?.focus()
    scrollActiveIntoView()
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

  function choose(value: string) {
    emit('update:modelValue', value)
    close(true)
  }

  async function onKeydown(e: KeyboardEvent) {
    if (!open.value) {
      if (e.target === trigger.value && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
        e.preventDefault()
        await openPopover()
      }
      return
    }
    if (e.key === 'Escape') {
      e.preventDefault()
      e.stopPropagation()
      close(true)
    } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
      active.value = moveActive(active.value, e.key, visible.value.length)
      await nextTick()
      scrollActiveIntoView()
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const option = visible.value[active.value]
      if (option) choose(option.value)
    }
  }

  function onDocumentPointerDown(e: MouseEvent) {
    if (open.value && root.value && !root.value.contains(e.target as Node)) close(false)
  }

  function onFocusOut(e: FocusEvent) {
    const next = e.relatedTarget as Node | null
    if (open.value && next && root.value && !root.value.contains(next)) close(false)
  }

  onMounted(() => document.addEventListener('mousedown', onDocumentPointerDown))
  onBeforeUnmount(() => document.removeEventListener('mousedown', onDocumentPointerDown))

  return { open, query, active, root, trigger, search, list, popover, resolvedAlign, shift, visible, selected, toggleOpen, choose, onKeydown, onFocusOut }
}
