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
