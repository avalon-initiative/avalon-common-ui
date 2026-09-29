<script setup lang="ts">
// Convention: no <style> blocks and no non-trivial logic in .vue files.
import styles from '../styles/AvalonDetailList.module.scss'
import type { AvalonDetailListProps } from '../types/AvalonDetailList.types'

defineProps<AvalonDetailListProps>()
</script>

<template>
  <section :class="styles.detail">
    <h3 v-if="title" :class="styles.title">{{ title }}</h3>
    <dl :class="styles.list">
      <div v-for="item in items" :key="item.label" :class="[styles.row, item.block ? styles.blockRow : '']">
        <dt :class="styles.label">{{ item.label }}</dt>
        <dd :class="[styles.value, item.mono || item.block ? styles.mono : '', item.block ? styles.block : '']">{{ item.value }}</dd>
      </div>
    </dl>
  </section>
</template>
