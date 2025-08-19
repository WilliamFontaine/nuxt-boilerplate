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

  const schema = computed(() =>
    z.object({
      email: z
        .string()
        .min(1, t('auth.forgotPassword.email.validation.required'))
        .refine((val) => VALIDATION_PATTERNS.EMAIL.test(val), {
          message: t('auth.forgotPassword.email.validation.invalid')
        })
        .max(TEXT_FIELD_LIMITS.EMAIL.MAX, t('auth.forgotPassword.email.validation.maxLength'))
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
