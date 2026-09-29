import type { Meta, StoryObj } from '@storybook/vue3'
import AvalonTimelineStrip from '../components/AvalonTimelineStrip.vue'
import type { AvalonTimelineItem } from '../types/AvalonTimelineStrip.types'

const snapshots = (count: number): AvalonTimelineItem[] =>
  Array.from({ length: count }, (_, i) => ({
    id: `s${i}`,
    subtitle: `10:${String(i).padStart(2, '0')}:00`,
    note: i === 0 ? 'first' : i % 5 === 0 ? '+2 -1 ~1' : i % 3 === 0 ? '+1' : 'no change',
    tone: i === 0 ? 'neutral' : i % 5 === 0 ? 'warning' : i % 3 === 0 ? 'success' : 'neutral',
    tag: i === count - 1 ? 'latest' : undefined,
  }))

const meta: Meta<typeof AvalonTimelineStrip> = {
  title: 'Avalon/TimelineStrip',
  component: AvalonTimelineStrip,
  args: { items: snapshots(5), label: 'Snapshots' },
  argTypes: { onSelect: { action: 'select' } },
}
export default meta

type Story = StoryObj<typeof AvalonTimelineStrip>

export const Default: Story = {}
export const WithCurrent: Story = { args: { current: 's2' } }
export const Tones: Story = {
  args: {
    current: 's1',
    items: [
      { id: 'a', note: 'first' },
      { id: 'b', note: '+2 joined', tone: 'success', subtitle: '10:01:00' },
      { id: 'c', note: '-1 departed', tone: 'danger', subtitle: '10:02:00' },
      { id: 'd', note: '~1 changed', tone: 'warning', subtitle: '10:03:00', tag: 'latest' },
    ],
  },
}
export const Wrapped: Story = { args: { items: snapshots(40), current: 's7' } }
