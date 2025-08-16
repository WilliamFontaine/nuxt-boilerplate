export const useLoginForm = () => {
  const { t } = useI18n()

  const state = reactive<LoginFormState>({ ...initialLoginState })

  const setState = (data: Partial<LoginFormState> | null) => {
    if (!data) return
    Object.assign(state, data)
  }

  const resetState = () => {
    Object.assign(state, { ...initialLoginState })
  }

  const schema = computed(() =>
    z.object({
      email: z
        .string()
        .min(1, t('auth.login.email.validation.required'))
        .refine((val) => VALIDATION_PATTERNS.EMAIL.test(val), {
          message: t('auth.login.email.validation.invalid')
        })
        .max(TEXT_FIELD_LIMITS.EMAIL.MAX, t('auth.login.email.validation.maxLength')),
      password: z
        .string()
        .min(1, t('auth.login.password.validation.required'))
        .min(TEXT_FIELD_LIMITS.PASSWORD.MIN, t('auth.login.password.validation.minLength'))
        .max(TEXT_FIELD_LIMITS.PASSWORD.MAX, t('auth.login.password.validation.maxLength'))
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
