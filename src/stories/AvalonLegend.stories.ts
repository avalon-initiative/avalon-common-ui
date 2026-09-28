import type { Meta, StoryObj } from '@storybook/vue3'
import AvalonLegend from '../components/AvalonLegend.vue'

const meta: Meta<typeof AvalonLegend> = {
  title: 'Avalon/Legend',
  component: AvalonLegend,
  args: {
    title: 'Links',
    items: [
      { label: 'Active', shape: 'solid', tone: 'primary' },
      { label: 'Mirror source', shape: 'dashed', tone: 'secondary' },
      { label: 'Known only', shape: 'dotted', tone: 'muted' },
    ],
  },
}
export default meta

type Story = StoryObj<typeof AvalonLegend>

export const Links: Story = {}
export const Nodes: Story = {
  args: {
    title: 'Nodes',
    items: [
      { label: 'Healthy', tone: 'success' },
      { label: 'Stale', tone: 'warning' },
      { label: 'Unreachable', tone: 'danger' },
    ],
  },
}
