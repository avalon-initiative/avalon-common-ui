import type { Meta, StoryObj } from '@storybook/vue3'
import AvalonLegend from '../components/AvalonLegend.vue'

const meta: Meta<typeof AvalonLegend> = {
  title: 'Avalon/Legend',
  component: AvalonLegend,
  args: {
    groups: [
      {
        title: 'Links',
        items: [
          { label: 'Active', shape: 'solid', tone: 'primary' },
          { label: 'Mirror source', shape: 'dashed', tone: 'secondary' },
          { label: 'Known only', shape: 'dotted', tone: 'muted' },
        ],
      },
    ],
  },
}
export default meta

type Story = StoryObj<typeof AvalonLegend>

export const Links: Story = {}
export const Nodes: Story = {
  args: {
    groups: [
      {
        title: 'Nodes',
        items: [
          { label: 'Healthy', tone: 'success' },
          { label: 'Stale', tone: 'warning' },
          { label: 'Unreachable', tone: 'danger' },
        ],
      },
    ],
  },
}
export const Grouped: Story = {
  args: {
    groups: [
      { title: 'Links', items: [
        { label: 'Active link (solid line)', shape: 'solid', tone: 'primary' },
        { label: 'Mirror source', shape: 'dashed', tone: 'secondary' },
        { label: 'Known only (dotted line)', shape: 'dotted', tone: 'muted' },
      ] },
      { title: 'Node state', items: [
        { label: 'Healthy', tone: 'success' },
        { label: 'Reports itself stale', tone: 'warning' },
        { label: 'Unreachable or not visited', tone: 'danger' },
      ] },
      { title: 'Roles', items: [
        { label: 'Hoster', tone: 'primary' },
        { label: 'Witness', tone: 'secondary' },
        { label: 'Indexer', tone: 'tertiary' },
      ] },
    ],
  },
}
export const CustomGlyphs: Story = {
  args: {
    groups: [
      { title: 'Node role (shape)', items: [
        { label: 'Hoster (hexagon)', tone: 'primary' },
        { label: 'Witness (diamond)', tone: 'secondary' },
        { label: 'Alert (badge)', tone: 'danger' },
      ] },
      { title: 'Version ring', items: [
        { label: 'Newest (solid ring)', tone: 'success' },
        { label: 'Behind (dashed ring)', tone: 'warning' },
      ] },
    ],
  },
  render: (args) => ({
    components: { AvalonLegend },
    setup: () => ({ args }),
    template: `
      <AvalonLegend v-bind="args">
        <template #glyph="{ item }">
          <svg viewBox="-16 -16 32 32" width="28" height="28" aria-hidden="true">
            <polygon v-if="item.label.startsWith('Hoster')" points="0,-9 8,-4.5 8,4.5 0,9 -8,4.5 -8,-4.5" :fill="'var(--av-color-primary)'" />
            <polygon v-else-if="item.label.startsWith('Witness')" points="0,-9 9,0 0,9 -9,0" :fill="'var(--av-color-accent-secondary)'" />
            <template v-else-if="item.label.startsWith('Alert')">
              <circle r="7" :fill="'var(--av-color-text-muted)'" />
              <circle cx="9" cy="-9" r="6" :fill="'var(--av-color-danger)'" />
            </template>
            <template v-else>
              <circle r="7" :fill="'var(--av-color-primary)'" />
              <circle r="11" fill="none" stroke-width="2" :stroke="item.tone === 'success' ? 'var(--av-color-success)' : 'var(--av-color-warning)'" :stroke-dasharray="item.tone === 'success' ? undefined : '3 3'" />
            </template>
          </svg>
        </template>
      </AvalonLegend>`,
  }),
}
