import { ref } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3'
import AvalonMultiSelect from '../components/AvalonMultiSelect.vue'
import AvalonChip from '../components/AvalonChip.vue'

const meta: Meta<typeof AvalonMultiSelect> = {
  title: 'Avalon/MultiSelect',
  component: AvalonMultiSelect,
  args: {
    label: 'Role',
    modelValue: [],
    options: [
      { value: 'primary', label: 'Primary' },
      { value: 'witness', label: 'Witness' },
      { value: 'hoster', label: 'Hoster' },
    ],
  },
  // Keeps the v-model live so ticking works in the canvas; the extra height
  // leaves room for the popover.
  render: (args) => ({
    components: { AvalonMultiSelect, AvalonChip },
    setup() {
      const selected = ref<string[]>([...args.modelValue])
      return { args, selected }
    },
    template: `
      <div style="min-height: 26rem; padding: 1rem">
        <AvalonMultiSelect v-bind="args" v-model="selected" />
        <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 26rem">
          <AvalonChip v-for="v in selected" :key="v" :label="v" @remove="selected = selected.filter((s) => s !== v)" />
        </div>
      </div>`,
  }),
}
export default meta

type Story = StoryObj<typeof AvalonMultiSelect>

export const FewOptions: Story = {}

export const Preselected: Story = { args: { modelValue: ['primary', 'hoster'] } }

export const ManyOptions: Story = {
  args: {
    label: 'Version',
    options: Array.from({ length: 100 }, (_, i) => ({
      value: `v0.${i}.0`,
      label: `v0.${i}.0`,
      description: i % 10 === 0 ? 'release candidate' : undefined,
    })),
    modelValue: ['v0.3.0'],
  },
}

export const LongLabels: Story = {
  args: {
    label: 'Identity',
    options: [
      {
        value: 'a3f9c2d17e8b4a6f90d1c5e7b2a48f3c6d9e01ab7c4f5d2e8a1b3c6d9f0e2a41',
        label: 'a3f9c2d1…2a41',
        title: 'a3f9c2d17e8b4a6f90d1c5e7b2a48f3c6d9e01ab7c4f5d2e8a1b3c6d9f0e2a41',
      },
      {
        value: 'a-very-long-node-name-that-keeps-going-and-going-past-any-sane-width-limit',
        label: 'a-very-long-node-name-that-keeps-going-and-going-past-any-sane-width-limit',
      },
      { value: 'short', label: 'short' },
    ],
  },
}

export const NoSearch: Story = { args: { searchable: false } }

const atRight = () => ({
  template: '<div style="display: flex; justify-content: flex-end; padding-right: 1rem"><story /></div>',
})

// Trigger at the far right: 'auto' flips the popover to the trigger's end edge.
export const RightEdgeAuto: Story = { decorators: [atRight] }

export const ForcedEnd: Story = { args: { align: 'end' } }
