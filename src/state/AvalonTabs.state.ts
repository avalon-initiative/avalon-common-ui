// Pure key logic and id helpers for AvalonTabs.
export interface TabSpec {
  id: string
  disabled?: boolean
}

/** The id a key moves to (arrows wrap, Home/End jump), skipping disabled tabs; undefined for other keys. */
export function tabAfterKey(tabs: TabSpec[], current: string, key: string): string | undefined {
  const enabled = tabs.filter((t) => !t.disabled || t.id === current)
  const at = enabled.findIndex((t) => t.id === current)
  if (at < 0) return undefined
  if (key === 'Home') return enabled[0].id
  if (key === 'End') return enabled[enabled.length - 1].id
  if (key === 'ArrowRight') return enabled[(at + 1) % enabled.length].id
  if (key === 'ArrowLeft') return enabled[(at - 1 + enabled.length) % enabled.length].id
  return undefined
}

export const tabDomId = (prefix: string, id: string) => `${prefix}-tab-${id}`
export const panelDomId = (prefix: string, id: string) => `${prefix}-panel-${id}`

// A module counter (not Vue's useId) so ids stay unique across separate app instances on one page.
let instances = 0
export const nextTabsPrefix = () => `av-tabs-${++instances}`
