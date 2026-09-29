import type { Meta, StoryObj } from '@storybook/vue3'
import AvalonChip from '../components/AvalonChip.vue'

const meta: Meta<typeof AvalonChip> = {
  title: 'Avalon/Chip',
  component: AvalonChip,
  args: { label: 'witness' },
}
export default meta

type Story = StoryObj<typeof AvalonChip>

export const Default: Story = { args: { removable: false } }

export const Removable: Story = {}

export const LongLabel: Story = {
  args: {
    label: 'a-very-long-node-name-that-keeps-going-and-going-past-any-sane-width-limit',
    title: 'a-very-long-node-name-that-keeps-going-and-going-past-any-sane-width-limit',
  },
}
