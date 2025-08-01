export const usePreferences = () => {
  const store = usePreferencesStore()
  return {
    postViewMode: toRef(store, 'postViewMode'),
    postDisplayMode: toRef(store, 'postDisplayMode'),
    setPostViewMode: store.setPostViewMode,
    setPostDisplayMode: store.setPostDisplayMode,
    resetPreferences: store.resetPreferences
  }
}
