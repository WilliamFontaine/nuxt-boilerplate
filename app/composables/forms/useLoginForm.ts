export const useLoginForm = () => {
  const { t } = useI18n()

  const state = reactive<LoginData>({ ...initialLoginState })

  const setState = (data: Partial<LoginData> | null) => {
    if (!data) return
    Object.assign(state, data)
  }

  const resetState = () => {
    Object.assign(state, { ...initialLoginState })
  }

  const schema = computed(() => createLoginSchema(t))

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
