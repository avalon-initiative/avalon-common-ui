<script setup lang="ts">
// Convention: no <style> blocks and no non-trivial logic in .vue files.
import styles from '../styles/AvalonToggleSwitch.module.scss'
import type { AvalonToggleSwitchProps } from '../types/AvalonToggleSwitch.types'

withDefaults(defineProps<AvalonToggleSwitchProps>(), { showState: true })
defineEmits<{ 'update:modelValue': [value: boolean] }>()
</script>

<template>
  <label :class="[styles.root, compact ? styles.compact : '', disabled ? styles.disabled : '']" :title="title">
    <input
      type="checkbox"
      role="switch"
      :class="styles.input"
      :checked="modelValue"
      :disabled="disabled"
      @change="$emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
    />
    <span :class="styles.track" aria-hidden="true"><span :class="styles.thumb" /></span>
    <span :class="styles.text">
      <span :class="styles.label">{{ label }}</span>
      <span v-if="description" :class="styles.description">{{ description }}</span>
    </span>
    <span :class="[styles.state, showState ? '' : styles.srOnly]" data-testid="switch-state">{{ modelValue ? 'On' : 'Off' }}</span>
  </label>
</template>
