<script setup lang="ts">
// Convention: no <style> blocks and no non-trivial logic in .vue files.
import styles from '../styles/AvalonStatusBadge.module.scss'
import type { AvalonStatusBadgeProps } from '../types/AvalonStatusBadge.types'

withDefaults(defineProps<AvalonStatusBadgeProps>(), {
  tone: 'neutral',
})
</script>

<template>
  <span :class="styles.badge">
    <span :class="[styles.dot, styles[tone]]" />
    {{ label }}
  </span>
</template>
