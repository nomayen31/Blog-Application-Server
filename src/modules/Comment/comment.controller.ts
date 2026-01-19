import { CommentService } from "./comment.service";
import { Request, Response } from "express";

const createCommentController = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        req.body.authorId = user?.id || req.body.authorId;
        const comment = await CommentService.createCommnet(req.body);
        res.status(201).json(comment);
    } catch (error: any) {
        if (error.message === "Post not found") {
            res.status(404).json({
                error: "Post not found",
            })
            return
        }
        res.status(500).json({
            error: "Comment not created",
            details: error
        })
    }
}

export const CommentController = {
    createCommentController
}