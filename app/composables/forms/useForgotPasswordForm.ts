export const useForgotPasswordForm = () => {
  const { t } = useI18n()

  const state = reactive<ForgotPasswordData>({ ...initialForgotPasswordState })

  const setState = (data: Partial<ForgotPasswordData> | null) => {
    if (!data) return
    Object.assign(state, data)
  }

  const resetState = () => {
    Object.assign(state, { ...initialForgotPasswordState })
  }

  const schema = computed(() => createForgotPasswordSchema(t))

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
