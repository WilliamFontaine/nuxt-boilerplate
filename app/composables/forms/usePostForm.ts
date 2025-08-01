export const usePostForm = () => {
  const { t } = useI18n()

  const state = reactive<PostFormState>({ ...initialPostState })

  const setState = (data: Partial<PostFormState> | null) => {
    if (!data) return
    Object.assign(state, data)
  }

  const resetState = () => {
    Object.assign(state, { ...initialPostState })
  }

  // Schema with client-side translations only
  const schema = computed(() =>
    z.object({
      title: z
        .string()
        .trim()
        .refine((val) => val.length > 0, {
          message: t('postForm.fields.title.validation.required')
        })
        .min(TEXT_FIELD_LIMITS.TITLE.MIN, t('postForm.fields.title.validation.minLength'))
        .max(TEXT_FIELD_LIMITS.TITLE.MAX, t('postForm.fields.title.validation.maxLength')),
      content: z
        .string()
        .trim()
        .refine((val) => val.length > 0, {
          message: t('postForm.fields.content.validation.required')
        })
        .min(TEXT_FIELD_LIMITS.CONTENT.MIN, t('postForm.fields.content.validation.minLength'))
        .max(TEXT_FIELD_LIMITS.CONTENT.MAX, t('postForm.fields.content.validation.maxLength'))
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
