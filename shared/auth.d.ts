// auth.d.ts
declare module '#auth-utils' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface User extends PublicUser {}

  interface UserSession {
    user: User
    loggedInAt: Date
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface SecureSessionData {
    // Add your own fields if needed
  }
}

export {}
