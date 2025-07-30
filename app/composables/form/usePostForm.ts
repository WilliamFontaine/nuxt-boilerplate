export interface PostFormState {
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

  // Schema with client-side translations only
  const schema = computed(() =>
    z.object({
      title: z
        .string({ required_error: t('postForm.fields.title.validation.required') })
        .min(TEXT_FIELD_LIMITS.TITLE.MIN, t('postForm.fields.title.validation.minLength'))
        .max(TEXT_FIELD_LIMITS.TITLE.MAX, t('postForm.fields.title.validation.maxLength'))
        .trim(),
      content: z
        .string({ required_error: t('postForm.fields.content.validation.required') })
        .min(TEXT_FIELD_LIMITS.CONTENT.MIN, t('postForm.fields.content.validation.minLength'))
        .max(TEXT_FIELD_LIMITS.CONTENT.MAX, t('postForm.fields.content.validation.maxLength'))
        .trim()
    })
  )

  const isValid = computed(() => {
    const result = schema.value.safeParse(state)
    return result.success
  })

  const validate = () => schema.value.safeParse(state)

  return {
    state,
    setState,
    resetState,
    schema,
    isValid,
    validate
  }
}
