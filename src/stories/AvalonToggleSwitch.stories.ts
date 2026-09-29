import type { Meta, StoryObj } from '@storybook/vue3'
import AvalonToggleSwitch from '../components/AvalonToggleSwitch.vue'

const meta: Meta<typeof AvalonToggleSwitch> = {
  title: 'Avalon/ToggleSwitch',
  component: AvalonToggleSwitch,
  args: { label: 'Show known-only nodes', modelValue: false },
}
export default meta

type Story = StoryObj<typeof AvalonToggleSwitch>

export const Off: Story = {}
export const On: Story = { args: { modelValue: true } }
export const WithDescription: Story = {
  args: { modelValue: true, description: 'Nodes seen in peer lists but not yet visited.' },
}
export const Disabled: Story = { args: { disabled: true, description: 'Unavailable while loading.' } }
export const DisabledOn: Story = { args: { disabled: true, modelValue: true } }
