<script setup lang="ts">
// Convention: no <style> blocks and no non-trivial logic in .vue files.
// An in-flow side panel (below the content on narrow screens); it takes room rather than floating over it.
import { ref } from 'vue'
import styles from '../styles/AvalonDrawer.module.scss'
import { useDrawerBehavior } from '../state/AvalonDrawer.state'
import type { AvalonDrawerProps } from '../types/AvalonDrawer.types'

defineOptions({ inheritAttrs: false })
const props = withDefaults(defineProps<AvalonDrawerProps>(), { closeLabel: 'Close', reducedMotion: false })
const emit = defineEmits<{ close: [] }>()

const panel = ref<HTMLElement | null>(null)
useDrawerBehavior(() => props.open, panel, () => emit('close'))
</script>

<template>
  <Transition
    :css="!reducedMotion"
    :enter-from-class="styles.away"
    :leave-to-class="styles.away"
    :enter-active-class="styles.sliding"
    :leave-active-class="styles.sliding"
  >
    <aside
      v-if="open"
      ref="panel"
      :class="[styles.drawer, reducedMotion && styles.reduced]"
      role="complementary"
      :aria-label="label ?? title"
      tabindex="-1"
      v-bind="$attrs"
    >
      <header :class="styles.header">
        <h2 :class="styles.title">{{ title }}</h2>
        <button type="button" :class="styles.closeButton" :aria-label="closeLabel" @click="emit('close')">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </header>
      <div v-if="$slots.actions" :class="styles.actions">
        <slot name="actions" />
      </div>
      <div :class="styles.body">
        <slot />
      </div>
    </aside>
  </Transition>
</template>
