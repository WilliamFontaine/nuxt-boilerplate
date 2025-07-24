import prisma from '@@/lib/prisma'

export default defineEventHandler(async (event) => {
  try {
    const data = await validateBody(event, createPostSchema)

    const post = await prisma.post.create({
      data
    })

    return createCreatedResponse(post)
  } catch (error: any) {
    if (error.statusCode) throw error
    throw serverError('Failed to create post')
  }
})
