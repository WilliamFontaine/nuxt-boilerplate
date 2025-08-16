import prisma from '@@/lib/prisma'

/**
 * Post Service - Pure business logic without validation
 * Validation is handled in the API endpoints
 */

/**
 * Create a new post
 */
export async function createPost(
  postData: CreatePostData,
  authorId: string
): Promise<PostWithAuthor> {
  try {
    const post = await prisma.post.create({
      data: {
        title: postData.title,
        content: postData.content,
        authorId
      },
      include: {
        author: true
      }
    })

    return {
      ...post,
      author: toPublicUser(post.author),
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString()
    }
  } catch (error: any) {
    if (error.code === PRISMA_ERRORS.FOREIGN_KEY_CONSTRAINT_FAILED) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid author ID'
      })
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create post'
    })
  }
}

/**
 * Get all posts
 */
export async function getAllPosts(): Promise<PostWithAuthor[]> {
  const posts = await prisma.post.findMany({
    include: {
      author: true
    },
    orderBy: { createdAt: 'desc' }
  })

  return posts.map((post) => ({
    ...post,
    author: toPublicUser(post.author),
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString()
  }))
}

/**
 * Get post by ID
 */
export async function getPostById(id: string): Promise<PostWithAuthor | null> {
  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      author: true
    }
  })

  if (!post) {
    return null
  }

  return {
    ...post,
    author: toPublicUser(post.author),
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString()
  }
}

/**
 * Update post if user owns it
 */
export async function updatePost(
  id: string,
  postData: UpdatePostData,
  authorId: string
): Promise<PostWithAuthor> {
  // Check if post exists and user owns it
  const existingPost = await prisma.post.findUnique({
    where: { id },
    select: { authorId: true }
  })

  if (!existingPost) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Post not found'
    })
  }

  if (existingPost.authorId !== authorId) {
    throw createError({
      statusCode: 403,
      statusMessage: 'You can only edit your own posts'
    })
  }

  try {
    const post = await prisma.post.update({
      where: { id },
      data: postData,
      include: {
        author: true
      }
    })

    return {
      ...post,
      author: toPublicUser(post.author),
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString()
    }
  } catch (error: any) {
    if (error.code === PRISMA_ERRORS.RECORD_NOT_FOUND) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Post not found'
      })
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update post'
    })
  }
}

/**
 * Delete post if user owns it
 */
export async function deletePost(id: string, authorId: string): Promise<void> {
  // Check if post exists and user owns it
  const existingPost = await prisma.post.findUnique({
    where: { id },
    select: { authorId: true }
  })

  if (!existingPost) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Post not found'
    })
  }

  if (existingPost.authorId !== authorId) {
    throw createError({
      statusCode: 403,
      statusMessage: 'You can only delete your own posts'
    })
  }

  try {
    await prisma.post.delete({
      where: { id }
    })
  } catch (error: any) {
    if (error.code === PRISMA_ERRORS.RECORD_NOT_FOUND) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Post not found'
      })
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete post'
    })
  }
}
