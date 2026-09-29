// AvalonTimelineStrip and AvalonIssueList: selection, defaults and conditional parts.
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { AvalonTimelineStrip } from '../src'

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
