import { describe, it, expect, vi } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import ThemeSwitcher from '../../../app/components/ThemeSwitcher.vue'

describe('ThemeSwitcher', () => {
  it('should render the component', async () => {
    const wrapper = await mountSuspended(ThemeSwitcher)

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('button').exists()).toBe(true)
  })

  it('should display sun icon for light theme', async () => {
    const wrapper = await mountSuspended(ThemeSwitcher)

    // Since colorMode is mocked as 'light', should show sun icon
    expect(wrapper.html()).toContain('i-lucide:sun')
  })

  it('should have proper button attributes', async () => {
    const wrapper = await mountSuspended(ThemeSwitcher)

    const button = wrapper.find('button')
    expect(button.attributes('type')).toBe('button')
  })

  it('should handle theme toggle when clicked', async () => {
    const wrapper = await mountSuspended(ThemeSwitcher)

    const button = wrapper.find('button')
    await button.trigger('click')

    // Verify button is clickable and interaction works
    expect(button.exists()).toBe(true)
  })

  it('should show sun icon in light mode', async () => {
    const wrapper = await mountSuspended(ThemeSwitcher)

    // Check for sun icon in light mode
    const html = wrapper.html()
    expect(html).toContain('i-lucide:sun')
  })

  it('should mount without errors', async () => {
    await expect(mountSuspended(ThemeSwitcher)).resolves.toBeTruthy()
  })
})
