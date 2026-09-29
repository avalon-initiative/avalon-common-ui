// AvalonTimelineStrip and AvalonIssueList: selection, defaults and conditional parts.
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { AvalonIssueList, AvalonTimelineStrip } from '../src'

const snaps = [
  { id: 'a', subtitle: '10:00', note: 'first' },
  { id: 'b', subtitle: '10:05', note: '+1', tone: 'success' as const, tag: 'latest', title: 'tip' },
  { id: 'c', number: 'x9' },
]

describe('AvalonTimelineStrip', () => {
  it('renders one button per item in an ordered list', () => {
    const wrapper = mount(AvalonTimelineStrip, { props: { items: snaps } })
    expect(wrapper.find('ol').exists()).toBe(true)
    expect(wrapper.findAll('li button')).toHaveLength(3)
  })

  it('emits select with the item id', async () => {
    const wrapper = mount(AvalonTimelineStrip, { props: { items: snaps } })
    await wrapper.findAll('button')[1].trigger('click')
    expect(wrapper.emitted('select')).toEqual([['b']])
  })

  it('marks only the current item with aria-current', () => {
    const wrapper = mount(AvalonTimelineStrip, { props: { items: snaps, current: 'b' } })
    const buttons = wrapper.findAll('button')
    expect(buttons.map((b) => b.attributes('aria-current'))).toEqual([undefined, 'true', undefined])
    expect(buttons[1].classes().join(' ')).toMatch(/current/)
  })

  it('defaults the number to the position and honours an explicit one', () => {
    const wrapper = mount(AvalonTimelineStrip, { props: { items: snaps } })
    expect(wrapper.findAll('[data-testid="timeline-number"]').map((n) => n.text())).toEqual(['1', '2', 'x9'])
  })

  it('shows the tag only when given, and the note text', () => {
    const wrapper = mount(AvalonTimelineStrip, { props: { items: snaps } })
    const tags = wrapper.findAll('[data-testid="timeline-tag"]')
    expect(tags).toHaveLength(1)
    expect(tags[0].text()).toBe('latest')
    expect(wrapper.findAll('[data-testid="timeline-note"]').map((n) => n.text())).toEqual(['first', '+1'])
  })

  it('applies the tone class, defaulting to neutral, and the tooltip', () => {
    const wrapper = mount(AvalonTimelineStrip, { props: { items: snaps } })
    const buttons = wrapper.findAll('button')
    expect(buttons[0].classes().join(' ')).toMatch(/neutral/)
    expect(buttons[1].classes().join(' ')).toMatch(/success/)
    expect(buttons[1].attributes('title')).toBe('tip')
  })

  it('passes ariaLabel through', () => {
    const wrapper = mount(AvalonTimelineStrip, { props: { items: [{ id: 'a', ariaLabel: 'Snapshot 1, 2 joined' }] } })
    expect(wrapper.get('button').attributes('aria-label')).toBe('Snapshot 1, 2 joined')
  })

  it('renders an empty list without buttons', () => {
    const wrapper = mount(AvalonTimelineStrip, { props: { items: [] } })
    expect(wrapper.findAll('button')).toHaveLength(0)
  })
})

const issues = [
  { id: 'a', badge: 'Equivocation', tone: 'danger' as const, primary: 'node-a', secondary: 'conflict', title: 'tip a' },
  { id: 'b', badge: 'Stale', tone: 'warning' as const, primary: 'node-b' },
]

describe('AvalonIssueList', () => {
  it('shows the title with the item count', () => {
    const wrapper = mount(AvalonIssueList, { props: { title: 'Alerts', items: issues } })
    expect(wrapper.get('h3').text()).toBe('Alerts (2)')
  })

  it('omits the heading without a title and names the section by label', () => {
    const wrapper = mount(AvalonIssueList, { props: { items: issues, label: 'Alerts' } })
    expect(wrapper.find('h3').exists()).toBe(false)
    expect(wrapper.get('section').attributes('aria-label')).toBe('Alerts')
  })

  it('is not selectable by default: no buttons', () => {
    const wrapper = mount(AvalonIssueList, { props: { items: issues } })
    expect(wrapper.findAll('button')).toHaveLength(0)
    expect(wrapper.text()).toContain('node-a')
  })

  it('emits select with the id when selectable', async () => {
    const wrapper = mount(AvalonIssueList, { props: { items: issues, selectable: true } })
    const buttons = wrapper.findAll('button')
    expect(buttons).toHaveLength(2)
    await buttons[1].trigger('click')
    expect(wrapper.emitted('select')).toEqual([['b']])
  })

  it('renders nothing when empty', () => {
    const wrapper = mount(AvalonIssueList, { props: { title: 'Alerts', items: [] } })
    expect(wrapper.find('section').exists()).toBe(false)
    expect(wrapper.text()).toBe('')
  })

  it('renders the badge as text with a tone class', () => {
    const wrapper = mount(AvalonIssueList, { props: { items: issues } })
    const badges = wrapper.findAll('li > span:first-child')
    expect(badges.map((b) => b.text())).toEqual(['Equivocation', 'Stale'])
    expect(badges[0].classes().join(' ')).toMatch(/danger/)
    expect(badges[1].classes().join(' ')).toMatch(/warning/)
  })

  it('shows the secondary text only when given, and the tooltip', () => {
    const wrapper = mount(AvalonIssueList, { props: { items: issues } })
    expect(wrapper.text()).toContain('conflict')
    const rows = wrapper.findAll('li')
    expect(rows[0].attributes('title')).toBe('tip a')
    expect(rows[1].attributes('title')).toBeUndefined()
    expect(rows[1].findAll('span')).toHaveLength(2)
  })
})
