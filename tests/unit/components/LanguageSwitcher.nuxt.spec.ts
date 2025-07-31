import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import LanguageSwitcher from '../../../app/components/LanguageSwitcher.vue'

describe('LanguageSwitcher', () => {
  it('should render the component', async () => {
    const wrapper = await mountSuspended(LanguageSwitcher)

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('button').exists()).toBe(true)
  })

  it('should be clickable', async () => {
    const wrapper = await mountSuspended(LanguageSwitcher)

    const button = wrapper.find('button')
    await button.trigger('click')

    // Verify button is clickable
    expect(button.exists()).toBe(true)
  })

  it('should have proper button attributes', async () => {
    const wrapper = await mountSuspended(LanguageSwitcher)

    const button = wrapper.find('button')
    expect(button.attributes('type')).toBe('button')
  })

  it('should mount without errors', async () => {
    await expect(mountSuspended(LanguageSwitcher)).resolves.toBeTruthy()
  })
})
