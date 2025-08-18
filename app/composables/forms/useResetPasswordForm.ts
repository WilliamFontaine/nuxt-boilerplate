export const useResetPasswordForm = () => {
  const { t } = useI18n()

  const state = reactive<ResetPasswordFormState>({ ...initialResetPasswordState })

  const setState = (data: Partial<ResetPasswordFormState> | null) => {
    if (!data) return
    Object.assign(state, data)
  }

  const resetState = () => {
    Object.assign(state, { ...initialResetPasswordState })
  }

  const schema = computed(() =>
    z
      .object({
        token: z.string().min(1, t('auth.resetPassword.token.validation.required')),
        password: z
          .string()
          .min(1, t('auth.resetPassword.password.validation.required'))
          .min(
            TEXT_FIELD_LIMITS.PASSWORD.MIN,
            t('auth.resetPassword.password.validation.minLength')
          )
          .max(
            TEXT_FIELD_LIMITS.PASSWORD.MAX,
            t('auth.resetPassword.password.validation.maxLength')
          )
          .regex(VALIDATION_PATTERNS.PASSWORD, t('auth.resetPassword.password.validation.pattern')),
        confirmPassword: z
          .string()
          .min(1, t('auth.resetPassword.confirmPassword.validation.required'))
      })
      .refine((data) => data.password === data.confirmPassword, {
        message: t('auth.resetPassword.confirmPassword.validation.match'),
        path: ['confirmPassword']
      })
  )

  const validate = () => schema.value.safeParse(state)

  return {
    state,
    setState,
    resetState,
    schema,
    validate
  }
}
