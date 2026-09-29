import { ref } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3'
import AvalonButton from '../components/AvalonButton.vue'
import AvalonDrawer from '../components/AvalonDrawer.vue'

const meta: Meta<typeof AvalonDrawer> = {
  title: 'Avalon/Drawer',
  component: AvalonDrawer,
  args: { open: true, title: 'Details', closeLabel: 'Close', reducedMotion: false },
  parameters: { layout: 'fullscreen' },
}
export default meta

type Story = StoryObj<typeof AvalonDrawer>

// A wrapping flex row: beside the content on wide viewports, below it under 1024px (the drawer goes full width).
const template = `
  <div style="display:flex;flex-wrap:wrap;height:28rem;overflow:auto;border:1px solid var(--av-color-border)">
    <main style="flex:1 1 12rem;min-width:0;padding:var(--av-space-4)">
      <p>Content area. It refits when the drawer opens.</p>
      <AvalonButton label="Toggle drawer" @click="shown = !shown" />
    </main>
    <AvalonDrawer v-bind="args" :open="shown" @close="shown = false">
      <template #actions><AvalonButton label="Primary action" /><AvalonButton label="Other" variant="secondary" /></template>
      <p>Drawer body. Any content goes here.</p>
    </AvalonDrawer>
  </div>`

const render: Story['render'] = (args) => ({
  components: { AvalonDrawer, AvalonButton },
  setup: () => ({ args, shown: ref(args.open) }),
  template,
})

export const Default: Story = { render }
export const Closed: Story = { render, args: { open: false } }
export const ReducedMotion: Story = { render, args: { reducedMotion: true } }

// Non-prop attributes land on the drawer's own <aside>.
export const ForwardedAttributes: Story = {
  render: (args) => ({
    components: { AvalonDrawer },
    setup: () => ({ args }),
    template: '<AvalonDrawer v-bind="args" data-testid="node-drawer" />',
  }),
}
