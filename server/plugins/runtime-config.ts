/**
 * Runtime configuration plugin
 * Applies runtime configuration to modules that don't support it natively
 */
export default defineNitroPlugin((nitroApp) => {
  const config = useRuntimeConfig()
  // Override CORS origin if provided via environment variable
  if (config.corsOrigin) {
    // @ts-expect-error - accessing internal config
    nitroApp.$config.security.corsHandler.origin = config.corsOrigin.split(',')
  }
})
