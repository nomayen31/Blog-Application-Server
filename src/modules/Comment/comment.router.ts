import express, { Router } from "express";
import { CommentController } from "./comment.controller";
import auth, { UserRole } from "../../middleware/auth";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: API for managing comments and replies
 */

/**
 * @swagger
 * /comments:
 *   post:
 *     summary: Create a new comment or reply
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *               - postId
 *             properties:
 *               content:
 *                 type: string
 *                 example: "This is a great post!"
 *               postId:
 *                 type: string
 *                 format: uuid
 *                 example: "c6d6f0b5-4f79-47b8-b2d4-38a102993985"
 *               parentId:
 *                 type: string
 *                 format: uuid
 *                 description: ID of the parent comment if this is a reply
 *                 example: "e4024344-981f-4318-97fb-2c9769da81e3"
 *     responses:
 *       201:
 *         description: Comment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "550e8400-e29b-41d4-a716-446655440000"
 *                 content:
 *                   type: string
 *                   example: "This is a great post!"
 *                 authorId:
 *                   type: string
 *                   example: "user-123"
 *                 postId:
 *                   type: string
 *                   example: "post-123"
 *                 Status:
 *                   type: string
 *                   example: "APPROVED"
 *       404:
 *         description: Post or Parent Comment not found
 *       500:
 *         description: Server error
 */
router.post('/', auth(UserRole.USER, UserRole.ADMIN), CommentController.createCommentController)

/**
 * @swagger
 * /comments/{id}:
 *   get:
 *     summary: Get a comment by ID
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the comment to retrieve
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Comment retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "550e8400-e29b-41d4-a716-446655440000"
 *                 content:
 *                   type: string
 *                   example: "This is a great post!"
 *                 authorId:
 *                   type: string
 *                   example: "user-123"
 *                 postId:
 *                   type: string
 *                   example: "post-123"
 *                 Status:
 *                   type: string
 *                   example: "APPROVED"
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Server error
 */
router.get('/:id', auth(UserRole.USER, UserRole.ADMIN), CommentController.getCommentByIdController)

/**
 * @swagger
 * /comments/author/{authorId}:
 *   get:
 *     summary: Get comments by author ID
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: authorId
 *         required: true
 *         description: ID of the author to retrieve comments for
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Comments retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "550e8400-e29b-41d4-a716-446655440000"
 *                   content:
 *                     type: string
 *                     example: "This is a great post!"
 *                   authorId:
 *                     type: string
 *                     example: "user-123"
 *                   postId:
 *                     type: string
 *                     example: "post-123"
 *                   Status:
 *                     type: string
 *                     example: "APPROVED"
 *       404:
 *         description: Comments not found
 *       500:
 *         description: Server error
 */
router.get('/author/:authorId', auth(UserRole.USER, UserRole.ADMIN), CommentController.getCommentsByAuthorIDController)

/**
 * @swagger
 * /comments/{id}:
 *   delete:
 *     summary: Delete a comment by ID
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the comment to delete
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "550e8400-e29b-41d4-a716-446655440000"
 *                 content:
 *                   type: string
 *                   example: "This is a great post!"
 *                 authorId:
 *                   type: string
 *                   example: "user-123"
 *                 postId:
 *                   type: string
 *                   example: "post-123"
 *                 Status:
 *                   type: string
 *                   example: "APPROVED"
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', auth(UserRole.USER, UserRole.ADMIN), CommentController.deleteCommentByIdController)

/**
 * @swagger
 * /comments/{id}:
 *   PATCH:
 *     summary: Update a comment by ID
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the comment to update
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 example: "This is a great post!"
 *               authorId:
 *                 type: string
 *                 example: "user-123"
 *               postId:
 *                 type: string
 *                 example: "post-123"
 *               parentId:
 *                 type: string
 *                 description: ID of the parent comment if this is a reply
 *                 example: "e4024344-981f-4318-97fb-2c9769da81e3"
 *     responses:
 *       200:
 *         description: Comment updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "550e8400-e29b-41d4-a716-446655440000"
 *                 content:
 *                   type: string
 *                   example: "This is a great post!"
 *                 authorId:
 *                   type: string
 *                   example: "user-123"
 *                 postId:
 *                   type: string
 *                   example: "post-123"
 *                 Status:
 *                   type: string
 *                   example: "APPROVED"
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Server error
 */

router.patch('/:id', auth(UserRole.USER, UserRole.ADMIN), CommentController.updateCommentByIdController)

/**
 * @swagger
 * /comments/{id}/moderate:
 *   patch:
 *     summary: Moderate a comment (Admin only)
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the comment to moderate
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [APPROVED, REJECT]
 *                 example: "REJECT"
 *     responses:
 *       200:
 *         description: Comment status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Comment status updated successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Comment'
 *       400:
 *         description: Invalid input
 *       403:
 *         description: Unauthorized (Admin only)
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Server error
 */
router.patch('/:id/moderate', auth(UserRole.ADMIN), CommentController.modarateCommentController)

export const CommentRouter: Router = router;
