import express from 'express';
import { postController } from './post.controller';

const router = express.Router();


router.post('/',postController.createPost
)
router.delete('/:id',postController.deletePost)


export const postRouter: express.Router = router;