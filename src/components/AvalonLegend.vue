<script setup lang="ts">
// Convention: no <style> blocks and no non-trivial logic in .vue files.
import styles from '../styles/AvalonLegend.module.scss'
import type { AvalonLegendProps } from '../types/AvalonLegend.types'

defineProps<AvalonLegendProps>()
</script>

<template>
  <section :class="styles.legend">
    <div v-for="(group, index) in groups" :key="group.title ?? index" :class="styles.group">
      <h3 v-if="group.title" :class="styles.title">{{ group.title }}</h3>
      <ul :class="styles.list">
        <li v-for="item in group.items" :key="item.id ?? item.label" :class="styles.item">
          <slot name="glyph" :item="item">
            <span :class="[styles.swatch, styles[item.shape ?? 'dot'], styles[item.tone ?? 'primary']]" />
          </slot>
          <span :class="styles.text">{{ item.label }}</span>
        </li>
      </ul>
    </div>
  </section>
</template>
