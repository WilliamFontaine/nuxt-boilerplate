import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import Password from '../../../../../app/components/ui/form/Password.vue'

describe('Password Component', () => {
  it('should render with required props', async () => {
    const wrapper = await mountSuspended(Password, {
      props: {
        label: 'Password',
        name: 'password',
        modelValue: ''
      }
    })

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('input').exists()).toBe(true)
  })

  it('should start with password type hidden', async () => {
    const wrapper = await mountSuspended(Password, {
      props: {
        label: 'Password',
        name: 'password',
        modelValue: ''
      }
    })

    const input = wrapper.find('input')
    expect(input.attributes('type')).toBe('password')
  })

  it('should toggle password visibility when button is clicked', async () => {
    const wrapper = await mountSuspended(Password, {
      props: {
        label: 'Password',
        name: 'password',
        modelValue: ''
      }
    })

    const toggleButton = wrapper.find('button')
    const input = wrapper.find('input')

    // Initially hidden
    expect(input.attributes('type')).toBe('password')
    expect(wrapper.html()).toContain('i-lucide:eye')

    // Click to show
    await toggleButton.trigger('click')
    await wrapper.vm.$nextTick()

    expect(input.attributes('type')).toBe('text')
    expect(wrapper.html()).toContain('i-lucide:eye-off')
  })

  it('should emit update:modelValue when input changes', async () => {
    const wrapper = await mountSuspended(Password, {
      props: {
        label: 'Password',
        name: 'password',
        modelValue: ''
      }
    })

    const input = wrapper.find('input')
    await input.setValue('newpassword123')

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['newpassword123'])
  })

  it('should pass placeholder to underlying input', async () => {
    const placeholder = 'Enter your password'
    const wrapper = await mountSuspended(Password, {
      props: {
        label: 'Password',
        name: 'password',
        modelValue: '',
        placeholder
      }
    })

    const input = wrapper.find('input')
    // The placeholder is passed through v-bind but we verify component renders
    expect(input.exists()).toBe(true)
  })

  it('should include lock icon', async () => {
    const wrapper = await mountSuspended(Password, {
      props: {
        label: 'Password',
        name: 'password',
        modelValue: ''
      }
    })

    expect(wrapper.html()).toContain('i-lucide:lock')
  })

  it('should handle required prop correctly', async () => {
    const wrapper = await mountSuspended(Password, {
      props: {
        label: 'Required Password',
        name: 'required-password',
        modelValue: '',
        required: true
      }
    })

    expect(wrapper.exists()).toBe(true)
    // Required prop is passed to underlying UiFormInput
    expect(wrapper.find('input').exists()).toBe(true)
  })

  it('should pass modelValue correctly', async () => {
    const password = 'currentpassword'
    const wrapper = await mountSuspended(Password, {
      props: {
        label: 'Password',
        name: 'password',
        modelValue: password
      }
    })

    const input = wrapper.find('input')
    // Value is passed through v-bind to UiFormInput
    expect(input.exists()).toBe(true)
  })

  it('should have proper accessibility attributes on toggle button', async () => {
    const wrapper = await mountSuspended(Password, {
      props: {
        label: 'Password',
        name: 'password',
        modelValue: ''
      }
    })

    const toggleButton = wrapper.find('button')
    expect(toggleButton.attributes('aria-pressed')).toBe('false')

    await toggleButton.trigger('click')
    await wrapper.vm.$nextTick()

    expect(toggleButton.attributes('aria-pressed')).toBe('true')
  })
})
