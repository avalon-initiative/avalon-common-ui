<script setup lang="ts">
// Convention: no <style> blocks and no non-trivial logic in .vue files.
import styles from '../styles/AvalonTimelineStrip.module.scss'
import type { AvalonTimelineStripProps } from '../types/AvalonTimelineStrip.types'

defineProps<AvalonTimelineStripProps>()
defineEmits<{ select: [id: string] }>()
</script>

<template>
  <ol :class="styles.strip" :aria-label="label">
    <li v-for="(item, position) in items" :key="item.id">
      <button
        type="button"
        :class="[styles.card, styles[item.tone ?? 'neutral'], item.id === current && styles.current]"
        :title="item.title"
        :aria-label="item.ariaLabel"
        :aria-current="item.id === current ? 'true' : undefined"
        @click="$emit('select', item.id)"
      >
        <span :class="styles.number" data-testid="timeline-number">{{ item.number ?? position + 1 }}</span>
        <span v-if="item.subtitle" :class="styles.subtitle">{{ item.subtitle }}</span>
        <span v-if="item.note" :class="styles.note" data-testid="timeline-note">{{ item.note }}</span>
        <span v-if="item.tag" :class="styles.tag" data-testid="timeline-tag">{{ item.tag }}</span>
      </button>
    </li>
  </ol>
</template>
