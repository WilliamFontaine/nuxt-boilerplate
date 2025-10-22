export const usePostForm = () => {
  const { t } = useI18n()

  const state = reactive<CreatePostData>({ ...initialPostState })

  const setState = (data: Partial<CreatePostData> | Post | null) => {
    if (!data) return

    Object.assign(state, data)
  }

  const resetState = () => {
    Object.assign(state, { ...initialPostState })
  }

  // Schema with client-side translations only
  const schema = computed(() => createPostSchema(t))

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
