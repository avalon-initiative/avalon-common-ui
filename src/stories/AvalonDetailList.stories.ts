import type { Meta, StoryObj } from '@storybook/vue3'
import AvalonDetailList from '../components/AvalonDetailList.vue'

const meta: Meta<typeof AvalonDetailList> = {
  title: 'Avalon/DetailList',
  component: AvalonDetailList,
  args: {
    title: 'Node',
    items: [
      { label: 'URL', value: 'http://192.168.7.113:8080', mono: true },
      { label: 'Role', value: 'Hoster' },
      { label: 'Round trip', value: '12 ms', mono: true },
    ],
  },
}
export default meta

type Story = StoryObj<typeof AvalonDetailList>

export const Default: Story = {}
export const WithoutTitle: Story = { args: { title: undefined } }
export const WithBlock: Story = {
  args: {
    items: [
      { label: 'URL', value: 'http://192.168.7.113:8080', mono: true },
      { label: 'Role', value: 'Hoster' },
      {
        label: 'Last error',
        value: 'sync failed: tree head mismatch\n  expected a1b2c3d4e5f60718293a4b5c6d7e8f90a1b2c3d4e5f60718293a4b5c6d7e8f9\n  got      ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
        block: true,
      },
    ],
  },
}
