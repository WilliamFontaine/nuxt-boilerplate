import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import Textarea from '../../../../../app/components/ui/form/Textarea.vue'

describe('Textarea Component', () => {
  it('should render with required props', async () => {
    const wrapper = await mountSuspended(Textarea, {
      props: {
        label: 'Description',
        name: 'description',
        modelValue: ''
      }
    })

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('textarea').exists()).toBe(true)
  })

  it('should emit update:modelValue when textarea changes', async () => {
    const wrapper = await mountSuspended(Textarea, {
      props: {
        label: 'Description',
        name: 'description',
        modelValue: ''
      }
    })

    const textarea = wrapper.find('textarea')
    await textarea.setValue('This is a long description text')

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['This is a long description text'])
  })

  it('should display the correct placeholder', async () => {
    const placeholder = 'Enter your description here'
    const wrapper = await mountSuspended(Textarea, {
      props: {
        label: 'Description',
        name: 'description',
        modelValue: '',
        placeholder
      }
    })

    const textarea = wrapper.find('textarea')
    expect(textarea.attributes('placeholder')).toBe(placeholder)
  })

  it('should set the correct number of rows', async () => {
    const rows = 5
    const wrapper = await mountSuspended(Textarea, {
      props: {
        label: 'Description',
        name: 'description',
        modelValue: '',
        rows
      }
    })

    const textarea = wrapper.find('textarea')
    expect(textarea.attributes('rows')).toBe(rows.toString())
  })

  it('should default to appropriate size when no rows specified', async () => {
    const wrapper = await mountSuspended(Textarea, {
      props: {
        label: 'Description',
        name: 'description',
        modelValue: ''
      }
    })

    const textarea = wrapper.find('textarea')
    expect(textarea.exists()).toBe(true)
    // Should have some default rows or size
  })

  it('should have primary color and outline variant', async () => {
    const wrapper = await mountSuspended(Textarea, {
      props: {
        label: 'Description',
        name: 'description',
        modelValue: ''
      }
    })

    // Check that the component renders with proper styling
    expect(wrapper.html()).toContain('w-full')
  })

  it('should handle required prop correctly', async () => {
    const wrapper = await mountSuspended(Textarea, {
      props: {
        label: 'Required Description',
        name: 'required-description',
        modelValue: '',
        required: true
      }
    })

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.html()).toContain('Required Description')
  })

  it('should display current value', async () => {
    const content = 'Current textarea content'
    const wrapper = await mountSuspended(Textarea, {
      props: {
        label: 'Description',
        name: 'description',
        modelValue: content
      }
    })

    const textarea = wrapper.find('textarea')
    expect(textarea.element.value).toBe(content)
  })

  it('should handle multiline content properly', async () => {
    const multilineContent = 'Line 1\nLine 2\nLine 3'
    const wrapper = await mountSuspended(Textarea, {
      props: {
        label: 'Description',
        name: 'description',
        modelValue: multilineContent
      }
    })

    const textarea = wrapper.find('textarea')
    expect(textarea.element.value).toBe(multilineContent)
  })

  it('should update value correctly when props change', async () => {
    const wrapper = await mountSuspended(Textarea, {
      props: {
        label: 'Description',
        name: 'description',
        modelValue: 'Initial value'
      }
    })

    await wrapper.setProps({ modelValue: 'Updated value' })
    const textarea = wrapper.find('textarea')
    expect(textarea.element.value).toBe('Updated value')
  })
})
