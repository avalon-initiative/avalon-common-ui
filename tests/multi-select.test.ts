// AvalonMultiSelect and AvalonChip behavior, plus the pure state helpers.
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { AvalonChip, AvalonMultiSelect } from '../src'
import { alignFor, clampShift, clear, filterOptions, toggleValue } from '../src/state/AvalonMultiSelect.state'

const options = [
  { value: 'role-admin', label: 'Admin', description: 'Full access' },
  { value: 'role-witness', label: 'Witness' },
  { value: 'hoster', label: 'Hoster', title: 'hoster-full-name' },
]

function mountSelect(props: Record<string, unknown> = {}) {
  return mount(AvalonMultiSelect, {
    props: { label: 'Role', options, modelValue: [], ...props },
    attachTo: document.body,
  })
}

const items = (w: ReturnType<typeof mountSelect>) => w.findAll('input[type="checkbox"]')

describe('AvalonMultiSelect state helpers', () => {
  it('filterOptions matches label and value case-insensitively', () => {
    expect(filterOptions(options, 'WIT').map((o) => o.value)).toEqual(['role-witness'])
    expect(filterOptions(options, 'role-').map((o) => o.value)).toEqual(['role-admin', 'role-witness'])
    expect(filterOptions(options, '  ')).toEqual(options)
    expect(filterOptions(options, 'zzz')).toEqual([])
  })

  it('toggleValue adds and removes without mutating', () => {
    const start = ['a']
    expect(toggleValue(start, 'b')).toEqual(['a', 'b'])
    expect(toggleValue(start, 'a')).toEqual([])
    expect(start).toEqual(['a'])
  })

  it('clear returns an empty list', () => {
    expect(clear()).toEqual([])
  })
})

describe('AvalonMultiSelect alignment helpers', () => {
  const g = 16

  it('alignFor picks start when the popover fits to the right of the trigger start', () => {
    expect(alignFor({ left: 20, right: 100 }, 320, 1000, g)).toBe('start')
  })

  it('alignFor picks end when start would overflow but end fits', () => {
    expect(alignFor({ left: 800, right: 900 }, 320, 1000, g)).toBe('end')
  })

  it('alignFor still answers when the popover is too wide for either side', () => {
    expect(alignFor({ left: 250, right: 300 }, 358, 390, g)).toBe('end')
    expect(alignFor({ left: 30, right: 80 }, 358, 390, g)).toBe('start')
  })

  it('clampShift is zero when aligned and inside, and pulls a too-wide popover inside the gutters', () => {
    expect(clampShift({ left: 20, right: 100 }, 320, 'start', 1000, g)).toBe(0)
    expect(clampShift({ left: 250, right: 300 }, 358, 'end', 390, g)).toBe(16 - (300 - 358))
    expect(clampShift({ left: 250, right: 300 }, 358, 'start', 390, g)).toBe(16 - 250)
  })
})

describe('AvalonMultiSelect', () => {
  it.each([
    ['end', true],
    ['start', false],
  ] as const)('align=%s forces the end-aligned class %s', async (align, expectEnd) => {
    const wrapper = mountSelect({ align })
    await wrapper.get('button').trigger('click')
    const popover = wrapper.get('[role="group"]').element.parentElement!
    expect(/alignEnd/.test(popover.className)).toBe(expectEnd)
    wrapper.unmount()
  })

  it('opens and closes from the trigger, wiring aria to the popover', async () => {
    const wrapper = mountSelect()
    const trigger = wrapper.get('button')
    expect(trigger.attributes('aria-haspopup')).toBe('true')
    await trigger.trigger('click')
    expect(trigger.attributes('aria-expanded')).toBe('true')
    const popover = wrapper.get(`#${CSS.escape(trigger.attributes('aria-controls')!)}`)
    expect(popover.isVisible()).toBe(true)
    await trigger.trigger('click')
    expect(trigger.attributes('aria-expanded')).toBe('false')
    expect(popover.isVisible()).toBe(false)
    wrapper.unmount()
  })

  it('focuses the search box on open', async () => {
    const wrapper = mountSelect()
    await wrapper.get('button').trigger('click')
    expect(document.activeElement).toBe(wrapper.get('input[type="text"]').element)
    wrapper.unmount()
  })

  it('narrows the list by search and shows the empty state', async () => {
    const wrapper = mountSelect()
    await wrapper.get('button').trigger('click')
    await wrapper.get('input[type="text"]').setValue('WITNESS')
    expect(items(wrapper)).toHaveLength(1)
    await wrapper.get('input[type="text"]').setValue('nothing')
    expect(items(wrapper)).toHaveLength(0)
    expect(wrapper.text()).toContain('No matches')
    wrapper.unmount()
  })

  it('uses a custom empty text and can hide the search box', async () => {
    const wrapper = mountSelect({ searchable: false, options: [], emptyText: 'Nothing here' })
    await wrapper.get('button').trigger('click')
    expect(wrapper.find('input[type="text"]').exists()).toBe(false)
    expect(wrapper.text()).toContain('Nothing here')
    wrapper.unmount()
  })

  it('emits the new list when an item is ticked or unticked', async () => {
    const wrapper = mountSelect({ modelValue: ['hoster'] })
    await wrapper.get('button').trigger('click')
    await items(wrapper)[0].setValue(true)
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([['hoster', 'role-admin']])
    await items(wrapper)[2].setValue(false)
    expect(wrapper.emitted('update:modelValue')![1]).toEqual([[]])
    wrapper.unmount()
  })

  it('reflects the selection in the checkboxes and the trigger count', async () => {
    const wrapper = mountSelect({ modelValue: ['role-admin', 'hoster'] })
    expect(wrapper.get('button').text()).toBe('Role · 2')
    await wrapper.get('button').trigger('click')
    expect(items(wrapper).map((i) => (i.element as HTMLInputElement).checked)).toEqual([
      true,
      false,
      true,
    ])
    wrapper.unmount()
  })

  it('shows the full value as a tooltip and the description', async () => {
    const wrapper = mountSelect()
    expect(wrapper.find('label[title="hoster-full-name"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('Full access')
    wrapper.unmount()
  })

  it('Clear unticks everything', async () => {
    const wrapper = mountSelect({ modelValue: ['hoster'] })
    await wrapper.get('button').trigger('click')
    const clearButton = wrapper.findAll('button').find((b) => b.text() === 'Clear')!
    await clearButton.trigger('click')
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([[]])
    wrapper.unmount()
  })

  it('Escape closes the popover and refocuses the trigger', async () => {
    const wrapper = mountSelect()
    const trigger = wrapper.get('button')
    await trigger.trigger('click')
    await wrapper.get('input[type="text"]').trigger('keydown', { key: 'Escape' })
    expect(trigger.attributes('aria-expanded')).toBe('false')
    expect(document.activeElement).toBe(trigger.element)
    wrapper.unmount()
  })

  it('an outside click closes the popover; an inside click does not', async () => {
    const wrapper = mountSelect()
    await wrapper.get('button').trigger('click')
    await wrapper.get('input[type="text"]').trigger('mousedown')
    expect(wrapper.get('button').attributes('aria-expanded')).toBe('true')
    document.body.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
    await wrapper.vm.$nextTick()
    expect(wrapper.get('button').attributes('aria-expanded')).toBe('false')
    wrapper.unmount()
  })

  it('ArrowDown from the search box moves to the first item', async () => {
    const wrapper = mountSelect()
    await wrapper.get('button').trigger('click')
    await wrapper.get('input[type="text"]').trigger('keydown', { key: 'ArrowDown' })
    expect(document.activeElement).toBe(items(wrapper)[0].element)
    await items(wrapper)[0].trigger('keydown', { key: 'ArrowDown' })
    expect(document.activeElement).toBe(items(wrapper)[1].element)
    wrapper.unmount()
  })

  it('exposes the list as a labelled group', () => {
    const wrapper = mountSelect()
    expect(wrapper.get('[role="group"]').attributes('aria-label')).toBe('Role')
    wrapper.unmount()
  })
})

describe('AvalonChip', () => {
  it('emits remove from a button with an accessible label', async () => {
    const wrapper = mount(AvalonChip, { props: { label: 'validator' } })
    const button = wrapper.get('button')
    expect(button.attributes('aria-label')).toBe('Remove validator')
    await button.trigger('click')
    expect(wrapper.emitted('remove')).toHaveLength(1)
  })

  it('hides the remove button when not removable and keeps the tooltip', () => {
    const wrapper = mount(AvalonChip, { props: { label: 'x', title: 'full text', removable: false } })
    expect(wrapper.find('button').exists()).toBe(false)
    expect(wrapper.get('span').attributes('title')).toBe('full text')
  })
})
