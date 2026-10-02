import { ref } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3'
import AvalonTabs from '../components/AvalonTabs.vue'

const meta: Meta<typeof AvalonTabs> = {
  title: 'Avalon/Tabs',
  component: AvalonTabs,
  args: {
    label: 'Tools',
    keepAlive: true,
    size: 'md',
    tabs: [
      { id: 'probe', label: 'Probe' },
      { id: 'alerts', label: 'Alerts', badge: '3' },
      { id: 'history', label: 'History', disabled: true },
      { id: 'settings', label: 'Settings' },
    ],
  },
}
export default meta

type Story = StoryObj<typeof AvalonTabs>

const render: Story['render'] = (args) => ({
  components: { AvalonTabs },
  setup: () => ({ args, active: ref(args.tabs?.[0]?.id ?? '') }),
  template: `
    <AvalonTabs v-bind="args" v-model="active" style="max-width:32rem">
      <template v-for="t in args.tabs" #[t.id] :key="t.id"><p>Panel for {{ t.label }}. <input aria-label="Scratch" /></p></template>
    </AvalonTabs>`,
})

export const Default: Story = { render }

export const ManyTabs: Story = {
  render,
  args: {
    tabs: ['Overview', 'Latency', 'Packets', 'Alerts', 'Peers', 'Witnesses', 'Settings', 'Export'].map((label, i) => ({
      id: label.toLowerCase(),
      label,
      badge: i === 3 ? '12' : undefined,
    })),
  },
}

export const Large: Story = { render, args: { size: 'lg' } }
