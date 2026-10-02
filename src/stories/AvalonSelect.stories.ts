import { ref } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3'
import AvalonSelect from '../components/AvalonSelect.vue'

const meta: Meta<typeof AvalonSelect> = {
  title: 'Avalon/Select',
  component: AvalonSelect,
  args: {
    label: 'Network',
    placeholder: 'Choose a network',
    options: [
      { value: 'avalon-dev-local', label: 'avalon-dev-local', description: 'This machine' },
      { value: 'avalon-dev-lan', label: 'avalon-dev-lan', description: '3 nodes' },
      { value: 'avalon-int', label: 'avalon-int' },
      { value: 'avalon-mainnet-1', label: 'avalon-mainnet-1' },
    ],
  },
}
export default meta

type Story = StoryObj<typeof AvalonSelect>

export const Default: Story = {
  render: (args) => ({
    components: { AvalonSelect },
    setup: () => ({ args, value: ref('') }),
    template: '<div style="min-height:18rem"><AvalonSelect v-bind="args" v-model="value" /><p>Chosen: {{ value || "none" }}</p></div>',
  }),
}

export const Preselected: Story = {
  render: (args) => ({
    components: { AvalonSelect },
    setup: () => ({ args, value: ref('avalon-dev-lan') }),
    template: '<div style="min-height:18rem"><AvalonSelect v-bind="args" v-model="value" /></div>',
  }),
}

export const Disabled: Story = { args: { disabled: true } }
