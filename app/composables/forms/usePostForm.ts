export const usePostForm = () => {
  const { t } = useI18n()

  const state = reactive<PostFormState>({ ...initialPostState })

  const setState = (data: Partial<PostFormState> | Post | null) => {
    if (!data) return

    // Handle conversion from Post (with nullable content) to PostFormState
    const formData: Partial<PostFormState> = {
      title: data.title,
      content: data.content ?? ''
    }

    Object.assign(state, formData)
  }

  const resetState = () => {
    Object.assign(state, { ...initialPostState })
  }

  // Schema with client-side translations only
  const schema = computed(() =>
    z.object({
      title: z
        .string()
        .min(1, t('articleForm.fields.title.validation.required'))
        .min(TEXT_FIELD_LIMITS.TITLE.MIN, t('articleForm.fields.title.validation.minLength'))
        .max(TEXT_FIELD_LIMITS.TITLE.MAX, t('articleForm.fields.title.validation.maxLength')),
      content: z
        .string()
        .min(1, t('articleForm.fields.content.validation.required'))
        .min(TEXT_FIELD_LIMITS.CONTENT.MIN, t('articleForm.fields.content.validation.minLength'))
        .max(TEXT_FIELD_LIMITS.CONTENT.MAX, t('articleForm.fields.content.validation.maxLength'))
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
