<script setup lang="ts">
// Convention: no <style> blocks and no non-trivial logic in .vue files.
// ARIA tabs: the tab strip plus one panel per tab, filled through slots named by tab id.
import { nextTick } from 'vue'
import styles from '../styles/AvalonTabs.module.scss'
import { nextTabsPrefix, panelDomId, tabAfterKey, tabDomId } from '../state/AvalonTabs.state'
import type { AvalonTabsProps } from '../types/AvalonTabs.types'

const props = withDefaults(defineProps<AvalonTabsProps>(), { keepAlive: true, size: 'md' })
const active = defineModel<string>({ required: true })

const prefix = nextTabsPrefix()

async function onKey(e: KeyboardEvent) {
  const next = tabAfterKey(props.tabs, active.value, e.key)
  if (!next) return
  e.preventDefault()
  active.value = next
  await nextTick()
  document.getElementById(tabDomId(prefix, next))?.focus()
}
</script>

<template>
  <div :class="styles.tabs">
    <div :class="styles.strip" role="tablist" :aria-label="label" @keydown="onKey">
      <button
        v-for="tab in tabs"
        :id="tabDomId(prefix, tab.id)"
        :key="tab.id"
        type="button"
        role="tab"
        :class="[styles.tab, size === 'lg' && styles.large, active === tab.id && styles.current]"
        :aria-selected="active === tab.id"
        :aria-controls="panelDomId(prefix, tab.id)"
        :tabindex="active === tab.id ? 0 : -1"
        :disabled="tab.disabled"
        @click="active = tab.id"
      >
        {{ tab.label }}<span v-if="tab.badge" :class="styles.badge">{{ tab.badge }}</span>
      </button>
    </div>
    <template v-for="tab in tabs" :key="tab.id">
      <div
        v-if="keepAlive || active === tab.id"
        v-show="active === tab.id"
        :id="panelDomId(prefix, tab.id)"
        role="tabpanel"
        tabindex="0"
        :aria-labelledby="tabDomId(prefix, tab.id)"
        :class="styles.panel"
      >
        <slot :name="tab.id" />
      </div>
    </template>
  </div>
</template>
