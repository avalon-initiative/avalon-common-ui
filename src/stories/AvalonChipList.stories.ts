import { ref } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3'
import AvalonChipList from '../components/AvalonChipList.vue'

const meta: Meta<typeof AvalonChipList> = {
  title: 'Avalon/ChipList',
  component: AvalonChipList,
  args: {
    label: 'Active filters',
    items: [
      { id: 'role-hoster', label: 'Role: Hoster' },
      { id: 'role-witness', label: 'Role: Witness' },
      { id: 'version', label: 'Version: 0.14.2' },
    ],
  },
  // Keeps the list live so removing a chip works in the canvas.
  render: (args) => ({
    components: { AvalonChipList },
    setup() {
      const items = ref([...args.items])
      return { args, items }
    },
    template: `<AvalonChipList v-bind="args" :items="items" @remove="(id) => (items = items.filter((i) => i.id !== id))" />`,
  }),
}
export default meta

type Story = StoryObj<typeof AvalonChipList>

export const Default: Story = {}

export const Wrapping: Story = {
  args: {
    items: Array.from({ length: 14 }, (_, i) => ({ id: `n${i}`, label: `node-${i + 1}.example.net` })),
  },
}

export const MixedRemovable: Story = {
  args: {
    items: [
      { id: 'a', label: 'Pinned', removable: false },
      { id: 'b', label: 'a-very-long-node-name-that-keeps-going-and-going-past-any-sane-width-limit', title: 'full name shown on hover' },
      { id: 'c', label: 'Witness' },
    ],
  },
}

export const Empty: Story = { args: { items: [] } }
