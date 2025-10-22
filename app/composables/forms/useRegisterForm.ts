export const useRegisterForm = () => {
  const { t } = useI18n()

  const state = reactive<RegisterData>({ ...initialRegisterState })

  const setState = (data: Partial<RegisterData> | null) => {
    if (!data) return
    Object.assign(state, data)
  }

  const resetState = () => {
    Object.assign(state, { ...initialRegisterState })
  }

  const schema = computed(() => createRegisterSchema(t))

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
