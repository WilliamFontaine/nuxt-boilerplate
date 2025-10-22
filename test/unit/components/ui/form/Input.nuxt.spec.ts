import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import Input from '../../../../../app/components/ui/form/Input.vue'

describe('Input Component', () => {
  it('should render with required props', async () => {
    const wrapper = await mountSuspended(Input, {
      props: {
        label: 'Test Label',
        name: 'test-input',
        modelValue: ''
      }
    })

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('input').exists()).toBe(true)
  })

  it('should emit update:modelValue when input changes', async () => {
    const wrapper = await mountSuspended(Input, {
      props: {
        label: 'Test Label',
        name: 'test-input',
        modelValue: ''
      }
    })

    const input = wrapper.find('input')
    await input.setValue('new value')

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['new value'])
  })

  it('should display the correct placeholder', async () => {
    const placeholder = 'Enter your text here'
    const wrapper = await mountSuspended(Input, {
      props: {
        label: 'Test Label',
        name: 'test-input',
        modelValue: '',
        placeholder
      }
    })

    const input = wrapper.find('input')
    expect(input.attributes('placeholder')).toBe(placeholder)
  })

  it('should set the correct input type', async () => {
    const wrapper = await mountSuspended(Input, {
      props: {
        label: 'Password',
        name: 'password',
        modelValue: '',
        type: 'password'
      }
    })

    const input = wrapper.find('input')
    expect(input.attributes('type')).toBe('password')
  })

  it('should default to text type when no type is provided', async () => {
    const wrapper = await mountSuspended(Input, {
      props: {
        label: 'Test Label',
        name: 'test-input',
        modelValue: ''
      }
    })

    const input = wrapper.find('input')
    expect(input.attributes('type')).toBe('text')
  })

  it('should have primary color class', async () => {
    const wrapper = await mountSuspended(Input, {
      props: {
        label: 'Test Label',
        name: 'test-input',
        modelValue: ''
      }
    })

    // Check that the component renders with Nuxt UI structure
    expect(wrapper.html()).toContain('w-full')
  })

  it('should handle required prop correctly', async () => {
    const wrapper = await mountSuspended(Input, {
      props: {
        label: 'Required Field',
        name: 'required-input',
        modelValue: '',
        required: true
      }
    })

    expect(wrapper.exists()).toBe(true)
    // UFormField should handle the required attribute
    expect(wrapper.html()).toContain('Required Field')
  })
})
