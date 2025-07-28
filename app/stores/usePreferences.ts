export const usePreferencesStore = defineStore('preferences', {
  state: () => ({
    postViewMode: 'list' as PostViewMode,
    postDisplayMode: 'compact' as PostDisplayMode
  }),
  actions: {
    setPostViewMode(mode: PostViewMode) {
      this.postViewMode = mode
    },
    setPostDisplayMode(mode: PostDisplayMode) {
      this.postDisplayMode = mode
    },
    resetPreferences() {
      this.postViewMode = 'list'
      this.postDisplayMode = 'compact'
    }
  },
  persist: {
    storage: piniaPluginPersistedstate.cookies({
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    })
  }
})
