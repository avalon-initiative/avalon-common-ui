<script setup lang="ts">
// Convention: no <style> blocks and no non-trivial logic in .vue files.
import styles from '../styles/AvalonIssueList.module.scss'
import type { AvalonIssueListProps } from '../types/AvalonIssueList.types'

withDefaults(defineProps<AvalonIssueListProps>(), { selectable: false })
defineEmits<{ select: [id: string] }>()
</script>

<template>
  <section v-if="items.length" :class="styles.list" :aria-label="label">
    <h3 v-if="title" :class="styles.title">{{ title }} ({{ items.length }})</h3>
    <ul :class="styles.items">
      <li v-for="item in items" :key="item.id" :class="styles.item" :title="item.title">
        <span :class="[styles.badge, styles[item.tone]]">{{ item.badge }}</span>
        <button v-if="selectable" type="button" :class="[styles.primary, styles.action]" @click="$emit('select', item.id)">
          {{ item.primary }}
        </button>
        <span v-else :class="styles.primary">{{ item.primary }}</span>
        <span v-if="item.secondary" :class="styles.secondary">{{ item.secondary }}</span>
      </li>
    </ul>
  </section>
</template>
