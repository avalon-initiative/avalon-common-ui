<script setup lang="ts">
// Convention: no <style> blocks and no non-trivial logic in .vue files —
// filtering, toggling and popover behavior live in AvalonMultiSelect.state.ts.
// The popover is absolutely positioned under the trigger (not teleported) so it
// follows the trigger and is not clipped by overflow of a toolbar ancestor.
import { useId } from 'vue'
import styles from '../styles/AvalonMultiSelect.module.scss'
import type { AvalonMultiSelectProps } from '../types/AvalonMultiSelect.types'
import { useMultiSelect } from '../state/AvalonMultiSelect.state'
import AvalonIcon from './AvalonIcon.vue'

const props = withDefaults(defineProps<AvalonMultiSelectProps>(), {
  searchPlaceholder: 'Search',
  searchable: true,
  emptyText: 'No matches',
  clearLabel: 'Clear',
})
const emit = defineEmits<{ 'update:modelValue': [value: string[]] }>()

const popoverId = useId()
const { open, query, root, trigger, search, list, visible, count, toggleOpen, toggle, clearAll, onKeydown, onFocusOut } =
  useMultiSelect(
    () => props.options,
    () => props.modelValue,
    () => props.searchable,
    emit,
  )
</script>

<template>
  <div ref="root" :class="styles.root" @keydown="onKeydown" @focusout="onFocusOut">
    <button
      ref="trigger"
      type="button"
      :class="[styles.trigger, open ? styles.triggerOpen : '']"
      aria-haspopup="true"
      :aria-expanded="open"
      :aria-controls="popoverId"
      @click="toggleOpen"
    >
      <span :class="styles.triggerText">{{ count > 0 ? `${label} · ${count}` : label }}</span>
      <AvalonIcon name="chevron-down" :size="16" :class="[styles.chevron, open ? styles.chevronOpen : '']" />
    </button>

    <div v-show="open" :id="popoverId" :class="styles.popover">
      <div :class="styles.header">
        <div v-if="searchable" :class="styles.searchWrap">
          <AvalonIcon name="search" :size="16" :class="styles.searchIcon" />
          <input
            ref="search"
            v-model="query"
            :class="styles.search"
            type="text"
            :placeholder="searchPlaceholder"
            :aria-label="`Search ${label}`"
            autocomplete="off"
          />
        </div>
        <button type="button" :class="styles.clear" :disabled="count === 0" @click="clearAll">
          {{ clearLabel }}
        </button>
      </div>

      <div ref="list" role="group" :aria-label="label" :class="styles.list">
        <label
          v-for="option in visible"
          :key="option.value"
          :class="styles.item"
          :title="option.title"
        >
          <input
            type="checkbox"
            :class="styles.checkbox"
            :checked="modelValue.includes(option.value)"
            @change="toggle(option.value)"
          />
          <span :class="styles.itemText">
            <span :class="styles.itemLabel">{{ option.label }}</span>
            <span v-if="option.description" :class="styles.itemDescription">{{ option.description }}</span>
          </span>
        </label>
        <p v-if="visible.length === 0" :class="styles.empty">{{ emptyText }}</p>
      </div>
    </div>
  </div>
</template>
