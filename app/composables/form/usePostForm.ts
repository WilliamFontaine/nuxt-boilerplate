import * as yup from 'yup'
import { ValidationError } from 'yup'

interface PostFormState {
  title: string
  content: string
}

export const usePostForm = () => {
  const { t } = useI18n()

  const initialState: PostFormState = {
    title: '',
    content: ''
  }

  const state = reactive<PostFormState>({ ...initialState })

  const setState = (data: Partial<PostFormState> | null) => {
    if (!data) return
    Object.assign(state, data)
  }

  const resetState = () => {
    Object.assign(state, { ...initialState })
  }

  const schema = computed(() =>
    yup.object().shape({
      title: yup
        .string()
        .required(t('postForm.fields.title.validation.required'))
        .min(TEXT_FIELD_LIMITS.TITLE.MIN, t('postForm.fields.title.validation.minLength'))
        .max(TEXT_FIELD_LIMITS.TITLE.MAX, t('postForm.fields.title.validation.maxLength')),
      content: yup
        .string()
        .required(t('postForm.fields.content.validation.required'))
        .min(TEXT_FIELD_LIMITS.CONTENT.MIN, t('postForm.fields.content.validation.minLength'))
        .max(TEXT_FIELD_LIMITS.CONTENT.MAX, t('postForm.fields.content.validation.maxLength'))
    })
  )

  const isValid = computed(() => {
    try {
      schema.value.validateSync(state)
      return true
    } catch {
      return false
    }
  })

  const validate = async () => {
    try {
      await schema.value.validate(state, { abortEarly: false })
      return { isValid: true, errors: [] }
    } catch (error) {
      if (error instanceof ValidationError) {
        return { isValid: false, errors: error.errors }
      }
      return { isValid: false, errors: ['Validation failed'] }
    }
  }

  return {
    state,
    setState,
    resetState,
    schema,
    isValid,
    validate
  }
}
