/**
 * NuxtAuth Handler - Basic Configuration
 *
 * This file provides the basic authentication setup using AuthJS (next-auth).
 * The complete authentication logic will be implemented in Part 3.
 */

import { NuxtAuthHandler } from '#auth'

export default NuxtAuthHandler({
  secret: useRuntimeConfig().authSecret,

  providers: [
    // Providers will be configured in Part 3
  ],

  session: {
    strategy: 'jwt'
  }
})
