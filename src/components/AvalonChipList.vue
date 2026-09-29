<script setup lang="ts">
// Convention: no <style> blocks and no non-trivial logic in .vue files.
import styles from '../styles/AvalonChipList.module.scss'
import type { AvalonChipListProps } from '../types/AvalonChipList.types'
import AvalonChip from './AvalonChip.vue'

defineProps<AvalonChipListProps>()
defineEmits<{ remove: [id: string] }>()
</script>

<template>
  <ul v-if="items.length > 0" :class="styles.list" :aria-label="label">
    <li v-for="item in items" :key="item.id" :class="styles.item">
      <AvalonChip
        :label="item.label"
        :title="item.title"
        :removable="item.removable ?? true"
        @remove="$emit('remove', item.id)"
      />
    </li>
  </ul>
</template>
