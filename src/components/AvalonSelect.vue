<script setup lang="ts">
// Convention: no <style> blocks and no non-trivial logic in .vue files; filtering, keys and popover
// placement live in AvalonSelect.state.ts. The popover is absolutely positioned under the trigger
// (not teleported), like AvalonMultiSelect, so an overflowing toolbar ancestor does not clip it.
import { useId } from 'vue'
import styles from '../styles/AvalonSelect.module.scss'
import type { AvalonSelectProps } from '../types/AvalonSelect.types'
import { useSelect } from '../state/AvalonSelect.state'
import AvalonIcon from './AvalonIcon.vue'

const props = withDefaults(defineProps<AvalonSelectProps>(), {
  placeholder: 'Choose',
  searchPlaceholder: 'Filter',
  emptyText: 'No matches',
  disabled: false,
  align: 'auto',
})
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const popoverId = useId()
const listId = `${popoverId}-list`
const { open, query, active, root, trigger, search, list, popover, resolvedAlign, shift, visible, selected, toggleOpen, choose, onKeydown, onFocusOut } = useSelect(
  () => props.options,
  () => props.modelValue,
  () => props.align,
  emit,
)
</script>

<template>
  <div ref="root" :class="styles.root" @keydown="onKeydown" @focusout="onFocusOut">
    <span :class="styles.caption">{{ label }}</span>
    <button
      ref="trigger"
      type="button"
      :class="[styles.trigger, open ? styles.triggerOpen : '']"
      :disabled="disabled"
      :aria-label="`${label}: ${selected?.label ?? placeholder}`"
      aria-haspopup="listbox"
      :aria-expanded="open"
      :aria-controls="popoverId"
      @click="toggleOpen"
    >
      <span :class="[styles.triggerText, !selected && styles.placeholder]">{{ selected?.label ?? placeholder }}</span>
      <AvalonIcon name="chevron-down" :size="16" :class="[styles.chevron, open ? styles.chevronOpen : '']" />
    </button>

    <div
      v-show="open"
      :id="popoverId"
      ref="popover"
      :class="[styles.popover, resolvedAlign === 'end' ? styles.alignEnd : '']"
      :style="{ '--av-select-shift': `${shift}px`, '--av-select-width': width }"
    >
      <div :class="styles.header">
        <div :class="styles.searchWrap">
          <AvalonIcon name="search" :size="16" :class="styles.searchIcon" />
          <input
            ref="search"
            v-model="query"
            :class="styles.search"
            type="text"
            role="combobox"
            aria-autocomplete="list"
            :aria-expanded="open"
            :aria-controls="listId"
            :aria-activedescendant="active >= 0 ? `${popoverId}-opt-${active}` : undefined"
            :placeholder="searchPlaceholder"
            :aria-label="`Filter ${label}`"
            autocomplete="off"
          />
        </div>
      </div>
      <ul :id="listId" ref="list" role="listbox" :aria-label="label" :class="styles.list">
        <li
          v-for="(option, index) in visible"
          :id="`${popoverId}-opt-${index}`"
          :key="option.value"
          role="option"
          :aria-selected="option.value === modelValue"
          :data-active="index === active"
          :class="[styles.item, index === active && styles.itemActive, option.value === modelValue && styles.itemChosen]"
          :title="option.title"
          @mousemove="active = index"
          @click="choose(option.value)"
        >
          <span :class="styles.itemLabel">{{ option.label }}</span>
          <span v-if="option.description" :class="styles.itemDescription">{{ option.description }}</span>
        </li>
        <li v-if="visible.length === 0" :class="styles.empty" role="presentation">{{ emptyText }}</li>
      </ul>
    </div>
  </div>
</template>
