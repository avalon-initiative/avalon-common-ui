<script setup lang="ts">
// Convention: no <style> blocks and no non-trivial logic in .vue files.
// Display only: the chip is not selectable or clickable, only removable.
import styles from '../styles/AvalonChip.module.scss'
import type { AvalonChipProps } from '../types/AvalonChip.types'
import AvalonIcon from './AvalonIcon.vue'

withDefaults(defineProps<AvalonChipProps>(), { removable: true })
defineEmits<{ remove: [] }>()
</script>

<template>
  <span :class="styles.chip" :title="title">
    <span :class="styles.label">{{ label }}</span>
    <button
      v-if="removable"
      type="button"
      :class="styles.remove"
      :aria-label="`Remove ${label}`"
      @click="$emit('remove')"
    >
      <AvalonIcon name="close" :size="12" />
    </button>
  </span>
</template>
