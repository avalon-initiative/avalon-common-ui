// Behavior of AvalonDrawer (Escape, focus, reduced motion) and AvalonTabs (keyboard, panels, ids).
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { AvalonDrawer, AvalonTabs } from '../src'
import { tabAfterKey } from '../src/state/AvalonTabs.state'

afterEach(() => {
  document.body.innerHTML = ''
})

function mountDrawer(props: Record<string, unknown> = {}, slots: Record<string, string> = {}) {
  return mount(AvalonDrawer, { props: { open: true, title: 'Details', ...props }, slots, attachTo: document.body, global: { stubs: { transition: false } } })
}

describe('AvalonDrawer behavior', () => {
  it('close button emits close and uses the closeLabel', async () => {
    const wrapper = mountDrawer({ closeLabel: 'Dismiss' })
    const button = wrapper.get('button')
    expect(button.attributes('aria-label')).toBe('Dismiss')
    await button.trigger('click')
    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  it('defaults the close label to Close and uses label for aria-label', () => {
    const wrapper = mountDrawer({ label: 'Node details' })
    expect(wrapper.get('button').attributes('aria-label')).toBe('Close')
    expect(wrapper.get('aside').attributes('aria-label')).toBe('Node details')
  })

  it('Escape emits close only while open', async () => {
    const wrapper = mountDrawer({ open: false })
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    expect(wrapper.emitted('close')).toBeUndefined()
    await wrapper.setProps({ open: true })
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    expect(wrapper.emitted('close')).toHaveLength(1)
    await wrapper.setProps({ open: false })
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  it('ignores Escape that was already handled and other keys', () => {
    const wrapper = mountDrawer()
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }))
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', cancelable: true }))
    expect(wrapper.emitted('close')).toHaveLength(1)
    const handled = new KeyboardEvent('keydown', { key: 'Escape', cancelable: true })
    handled.preventDefault()
    document.dispatchEvent(handled)
    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  it('moves focus in on open and returns it to the opener on close', async () => {
    const opener = document.createElement('button')
    document.body.append(opener)
    opener.focus()
    const wrapper = mountDrawer({ open: false })
    await wrapper.setProps({ open: true })
    await wrapper.vm.$nextTick()
    expect(document.activeElement).toBe(wrapper.get('aside').element)
    await wrapper.setProps({ open: false })
    expect(document.activeElement).toBe(opener)
  })

  it('removes the Escape listener on unmount', () => {
    const wrapper = mountDrawer()
    wrapper.unmount()
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    expect(wrapper.emitted('close')).toBeUndefined()
  })

  it('reducedMotion marks the panel and skips the slide classes', async () => {
    const wrapper = mountDrawer({ open: false, reducedMotion: true })
    await wrapper.setProps({ open: true })
    const classes = wrapper.get('aside').classes().join(' ')
    expect(classes).toMatch(/reduced/)
    expect(classes).not.toMatch(/sliding|away/)
  })

  it('without reducedMotion the panel is not marked reduced and slides in', async () => {
    const wrapper = mountDrawer({ open: false })
    await wrapper.setProps({ open: true })
    const classes = wrapper.get('aside').classes().join(' ')
    expect(classes).not.toMatch(/reduced/)
    expect(classes).toMatch(/sliding/)
  })

  it('renders the actions row only when the slot is given', () => {
    expect(mountDrawer().findAll('button')).toHaveLength(1)
    const wrapper = mountDrawer({}, { actions: '<button>Trace</button>' })
    expect(wrapper.findAll('button')).toHaveLength(2)
  })
})

describe('tabAfterKey', () => {
  const tabs = [{ id: 'a' }, { id: 'b', disabled: true }, { id: 'c' }, { id: 'd' }]

  it('arrows wrap and skip disabled tabs', () => {
    expect(tabAfterKey(tabs, 'a', 'ArrowRight')).toBe('c')
    expect(tabAfterKey(tabs, 'd', 'ArrowRight')).toBe('a')
    expect(tabAfterKey(tabs, 'c', 'ArrowLeft')).toBe('a')
    expect(tabAfterKey(tabs, 'a', 'ArrowLeft')).toBe('d')
  })

  it('Home and End jump to the first and last enabled tab', () => {
    expect(tabAfterKey([{ id: 'x', disabled: true }, ...tabs], 'c', 'Home')).toBe('a')
    expect(tabAfterKey([...tabs, { id: 'z', disabled: true }], 'a', 'End')).toBe('d')
  })

  it('ignores other keys and unknown current ids', () => {
    expect(tabAfterKey(tabs, 'a', 'Enter')).toBeUndefined()
    expect(tabAfterKey(tabs, 'nope', 'ArrowRight')).toBeUndefined()
  })
})

const tabs = [
  { id: 'a', label: 'A' },
  { id: 'b', label: 'B', disabled: true },
  { id: 'c', label: 'C', badge: '4' },
]

function mountTabs(props: Record<string, unknown> = {}) {
  return mount(AvalonTabs, {
    props: {
      tabs,
      modelValue: 'a',
      'onUpdate:modelValue': (v: string) => wrapperRef.setProps({ modelValue: v }),
      ...props,
    },
    slots: { a: '<input class="keep" />', b: 'B panel', c: 'C panel' },
    attachTo: document.body,
  })
}
let wrapperRef: ReturnType<typeof mountTabs>

describe('AvalonTabs behavior', () => {
  it('roving tabindex and aria-selected follow the active tab', () => {
    wrapperRef = mountTabs()
    const tabEls = wrapperRef.findAll('[role=tab]')
    expect(tabEls.map((t) => t.attributes('aria-selected'))).toEqual(['true', 'false', 'false'])
    expect(tabEls.map((t) => t.attributes('tabindex'))).toEqual(['0', '-1', '-1'])
  })

  it('tabs link to their panels both ways', () => {
    wrapperRef = mountTabs()
    const tab = wrapperRef.get('[role=tab]')
    const panel = wrapperRef.get('[role=tabpanel]')
    expect(tab.attributes('aria-controls')).toBe(panel.attributes('id'))
    expect(panel.attributes('aria-labelledby')).toBe(tab.attributes('id'))
  })

  it('clicking a tab emits update:modelValue; a disabled tab is not clickable', async () => {
    wrapperRef = mountTabs()
    await wrapperRef.findAll('[role=tab]')[2].trigger('click')
    expect(wrapperRef.emitted('update:modelValue')).toEqual([['c']])
    await wrapperRef.findAll('[role=tab]')[1].trigger('click')
    expect(wrapperRef.emitted('update:modelValue')).toHaveLength(1)
  })

  it('arrow keys move the selection past disabled tabs and focus the new tab', async () => {
    wrapperRef = mountTabs()
    await wrapperRef.get('[role=tablist]').trigger('keydown', { key: 'ArrowRight' })
    await wrapperRef.vm.$nextTick()
    expect(wrapperRef.emitted('update:modelValue')?.[0]).toEqual(['c'])
    expect(document.activeElement).toBe(wrapperRef.findAll('[role=tab]')[2].element)
    await wrapperRef.get('[role=tablist]').trigger('keydown', { key: 'Home' })
    expect(wrapperRef.emitted('update:modelValue')?.[1]).toEqual(['a'])
  })

  it('shows the badge as text', () => {
    wrapperRef = mountTabs()
    expect(wrapperRef.findAll('[role=tab]')[2].text()).toBe('C4')
  })

  it('keeps inactive panels mounted but hidden by default', async () => {
    wrapperRef = mountTabs()
    const panels = wrapperRef.findAll('[role=tabpanel]')
    expect(panels).toHaveLength(3)
    expect(panels.map((p) => p.isVisible())).toEqual([true, false, false])
    expect(wrapperRef.find('input.keep').exists()).toBe(true)
    await wrapperRef.setProps({ modelValue: 'c' })
    expect(wrapperRef.find('input.keep').exists()).toBe(true)
    expect(wrapperRef.findAll('[role=tabpanel]').map((p) => p.isVisible())).toEqual([false, false, true])
  })

  it('keepAlive=false renders only the active panel', async () => {
    wrapperRef = mountTabs({ keepAlive: false })
    expect(wrapperRef.findAll('[role=tabpanel]')).toHaveLength(1)
    expect(wrapperRef.find('input.keep').exists()).toBe(true)
    await wrapperRef.setProps({ modelValue: 'c' })
    expect(wrapperRef.findAll('[role=tabpanel]')).toHaveLength(1)
    expect(wrapperRef.find('input.keep').exists()).toBe(false)
    expect(wrapperRef.text()).toContain('C panel')
  })

  it('two instances never share ids', () => {
    const one = mountTabs()
    const two = mountTabs()
    const ids = [...one.findAll('[id]'), ...two.findAll('[id]')].map((e) => e.attributes('id'))
    expect(ids).toHaveLength(12)
    expect(new Set(ids).size).toBe(12)
  })
})
