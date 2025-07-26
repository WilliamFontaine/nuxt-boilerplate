import prisma from '@@/lib/prisma'

export default defineEventHandler(async (event) => {
  try {
    const { id } = await validateParams(event, deletePostSchema)

    await prisma.post.delete({
      where: { id }
    })

    return createDeletedResponse()
  } catch (error: any) {
    if (error.statusCode) throw error
    if (error.code === PRISMA_ERRORS.RECORD_NOT_FOUND) {
      throw notFoundError('Post not found')
    }
    console.error('Post deletion failed:', error)
    throw serverError('Failed to delete post')
  }
})
