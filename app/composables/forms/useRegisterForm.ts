export const useRegisterForm = () => {
  const { t } = useI18n()

  const state = reactive<RegisterFormState>({ ...initialRegisterState })

  const setState = (data: Partial<RegisterFormState> | null) => {
    if (!data) return
    Object.assign(state, data)
  }

  const resetState = () => {
    Object.assign(state, { ...initialRegisterState })
  }

  const schema = computed(() =>
    z
      .object({
        name: z
          .string()
          .min(1, t('auth.register.name.validation.required'))
          .min(TEXT_FIELD_LIMITS.NAME.MIN, t('auth.register.name.validation.minLength'))
          .max(TEXT_FIELD_LIMITS.NAME.MAX, t('auth.register.name.validation.maxLength')),
        email: z
          .string()
          .min(1, t('auth.register.email.validation.required'))
          .refine((val) => VALIDATION_PATTERNS.EMAIL.test(val), {
            message: t('auth.register.email.validation.invalid')
          })
          .max(TEXT_FIELD_LIMITS.EMAIL.MAX, t('auth.register.email.validation.maxLength')),
        password: z
          .string()
          .min(1, t('auth.register.password.validation.required'))
          .min(TEXT_FIELD_LIMITS.PASSWORD.MIN, t('auth.register.password.validation.minLength'))
          .max(TEXT_FIELD_LIMITS.PASSWORD.MAX, t('auth.register.password.validation.maxLength'))
          .refine((val) => VALIDATION_PATTERNS.PASSWORD.test(val), {
            message: t('auth.register.password.validation.pattern')
          }),
        confirmPassword: z.string().min(1, t('auth.register.confirmPassword.validation.required'))
      })
      .refine((data) => data.password === data.confirmPassword, {
        message: t('auth.register.confirmPassword.validation.match'),
        path: ['confirmPassword']
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
