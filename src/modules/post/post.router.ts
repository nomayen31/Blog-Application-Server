import express from "express";
import { postController } from "./post.controller";
import auth, { UserRole } from "../../middleware/auth";

const router = express.Router();



router.get("/", postController.getPosts);
router.post("/", auth(UserRole.USER), postController.createPost);
router.delete("/:id", postController.deletePost);

export const postRouter: express.Router = router;
 