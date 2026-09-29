// Behavior of AvalonDrawer (Escape, focus, reduced motion) and AvalonTabs (keyboard, panels, ids).
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { AvalonDrawer } from '../src'

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

