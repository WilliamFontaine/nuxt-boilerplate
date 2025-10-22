export const useResetPasswordForm = () => {
  const { t } = useI18n()

  const state = reactive<ResetPasswordData>({ ...initialResetPasswordState })

  const setState = (data: Partial<ResetPasswordData> | null) => {
    if (!data) return
    Object.assign(state, data)
  }

  const resetState = () => {
    Object.assign(state, { ...initialResetPasswordState })
  }

  const schema = computed(() => createResetPasswordSchema(t))

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
