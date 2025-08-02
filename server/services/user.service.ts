import prisma from '@@/lib/prisma'

/**
 * User Service - Pure business logic without validation
 * Validation is handled in the API endpoints
 */

/**
 * Create a new user with hashed password
 */
export async function createUser(userData: CreateUserData): Promise<PublicUser> {
  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: userData.email }
  })

  if (existingUser) {
    throw createError({
      statusCode: 409,
      statusMessage: 'User with this email already exists'
    })
  }

  // Hash password using auto-imported function from nuxt-auth-utils
  const hashedPassword = await hashPassword(userData.password)

  try {
    const user = await prisma.user.create({
      data: {
        email: userData.email,
        password: hashedPassword,
        name: userData.name
      }
    })

    return toPublicUser(user)
  } catch (error: any) {
    if (error.code === PRISMA_ERRORS.UNIQUE_CONSTRAINT_FAILED) {
      throw createError({
        statusCode: 409,
        statusMessage: 'User with this email already exists'
      })
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create user'
    })
  }
}

/**
 * Authenticate user with email and password
 */
export async function authenticateUser(email: string, password: string): Promise<PublicUser> {
  const user = await prisma.user.findUnique({
    where: { email }
  })

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid email or password'
    })
  }

  // Verify password using auto-imported function from nuxt-auth-utils
  const isPasswordValid = await verifyPassword(user.password, password)
  if (!isPasswordValid) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid email or password'
    })
  }

  return toPublicUser(user)
}

/**
 * Get user by ID
 */
export async function getUserById(id: number): Promise<PublicUser | null> {
  const user = await prisma.user.findUnique({
    where: { id }
  })

  return user ? toPublicUser(user) : null
}

/**
 * Check if user owns a specific post
 */
export async function userOwnsPost(userId: number, postId: number): Promise<boolean> {
  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: { authorId: true }
  })

  return post?.authorId === userId || false
}
