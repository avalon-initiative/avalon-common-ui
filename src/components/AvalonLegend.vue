<script setup lang="ts">
// Convention: no <style> blocks and no non-trivial logic in .vue files.
import styles from '../styles/AvalonLegend.module.scss'
import type { AvalonLegendProps } from '../types/AvalonLegend.types'

defineProps<AvalonLegendProps>()
</script>

<template>
  <section :class="styles.legend">
    <h3 v-if="title" :class="styles.title">{{ title }}</h3>
    <ul :class="styles.list">
      <li v-for="item in items" :key="item.label" :class="styles.item">
        <span :class="[styles.swatch, styles[item.shape ?? 'dot'], styles[item.tone ?? 'primary']]" />
        {{ item.label }}
      </li>
    </ul>
  </section>
</template>
