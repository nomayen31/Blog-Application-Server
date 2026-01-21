import express, { Application } from "express";
import { postRouter } from "./modules/post/post.router";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import cors from "cors";


const app: Application = express()


app.use(cors({
      origin: [
            "http://localhost:3000",   // frontend
            "http://localhost:3001",   // if you use another dev port
            process.env.APP_URL!
      ],
      credentials: true,   // REQUIRED for cookies & auth
      methods: ["GET", "POST", "PUT", "DELETE"],
      allowedHeaders: ["Content-Type", "Authorization"]
}));

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication and User management
 */

/**
 * @swagger
 * /api/auth/sign-up/email:
 *   post:
 *     summary: Sign up with email and password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - name
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *     responses:
 *       200:
 *         description: User created
 * 
 * /api/auth/sign-in/email:
 *   post:
 *     summary: Sign in with email and password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Signed in successfully
 */
app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json());

// Swagger Documentation
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";
import { CommentRouter } from "./modules/Comment/comment.router";
import globalErrorHandler from "./middleware/globalErrorHandler";
import { notFound } from "./middleware/notFound";
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/posts", postRouter)
app.use("/comments", CommentRouter)

app.get('/', (req, res) => {
      res.send("Hello World!")
})

app.use(notFound)
app.use(globalErrorHandler)

export default app;