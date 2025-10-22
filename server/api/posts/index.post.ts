/**
 * @openapi
 * /api/posts:
 *   post:
 *     summary: Create a new post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, content]
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Post created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  const t = await useTranslation(event)

  const postData = await validateBody(event, createPostSchema(t))

  const newPost = await createPost(postData, session.user.id)

  return createCreatedResponse(newPost)
})
