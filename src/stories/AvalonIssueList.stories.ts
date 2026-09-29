import type { Meta, StoryObj } from '@storybook/vue3'
import AvalonIssueList from '../components/AvalonIssueList.vue'

const meta: Meta<typeof AvalonIssueList> = {
  title: 'Avalon/IssueList',
  component: AvalonIssueList,
  args: {
    title: 'Alerts',
    label: 'Alerts',
    items: [
      {
        id: 'a',
        badge: 'Equivocation',
        tone: 'danger',
        primary: 'https://node-a.example:8443',
        secondary: 'Two conflicting tree heads at size 1204.',
      },
      {
        id: 'b',
        badge: 'Stale',
        tone: 'warning',
        primary: 'https://node-b.example:8443',
        secondary: 'No fresh tree head for 12 minutes.',
        title: 'Last head seen 12 minutes ago',
      },
      { id: 'c', badge: 'Unreachable', tone: 'danger', primary: 'https://node-c.example:8443' },
    ],
  },
  argTypes: { onSelect: { action: 'select' } },
}
export default meta

type Story = StoryObj<typeof AvalonIssueList>

export const Default: Story = {}
export const Selectable: Story = { args: { selectable: true } }
export const WarningOnly: Story = {
  args: {
    title: 'Stale nodes',
    items: [{ id: 'b', badge: 'Stale', tone: 'warning', primary: 'https://node-b.example:8443', title: 'Last head 12 minutes ago' }],
  },
}
export const Empty: Story = { args: { items: [] } }
