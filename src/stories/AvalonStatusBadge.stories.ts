import type { Meta, StoryObj } from '@storybook/vue3'
import AvalonStatusBadge from '../components/AvalonStatusBadge.vue'

const meta: Meta<typeof AvalonStatusBadge> = {
  title: 'Avalon/StatusBadge',
  component: AvalonStatusBadge,
  args: { label: 'Synced' },
}
export default meta

type Story = StoryObj<typeof AvalonStatusBadge>

export const Neutral: Story = {}
export const Success: Story = { args: { tone: 'success' } }
export const Warning: Story = { args: { label: 'Stale', tone: 'warning' } }
export const Danger: Story = { args: { label: 'Unreachable', tone: 'danger' } }
