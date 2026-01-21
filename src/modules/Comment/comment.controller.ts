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

const getCommentByIdController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!id || typeof id !== "string") {
            return res.status(400).json({
                error: "Invalid or missing comment id"
            });
        }

        const comment = await CommentService.getCommentById(id);
        res.status(200).json(comment);
    } catch (error: any) {
        res.status(500).json({
            error: "Comment not found",
            details: error.message
        });
    }
};

const getCommentsByAuthorIDController = async (req: Request, res: Response) => {
    try {
        const { authorId } = req.params;

        if (!authorId || typeof authorId !== "string") {
            return res.status(400).json({
                error: "Invalid or missing author id"
            });
        }

        const comments = await CommentService.getCommentsByAuthorID(authorId);
        res.status(200).json(comments);
    } catch (error: any) {
        res.status(500).json({
            error: "Comments not found",
            details: error.message
        });
    }
};

const deleteCommentByIdController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!id || typeof id !== "string") {
            return res.status(400).json({
                error: "Invalid or missing comment id"
            });
        }

        const comment = await CommentService.deleteCommentById(id);
        return res.status(200).json({
            success: true,
            message: "Comment deleted successfully",
            data: comment
        });
    } catch (error: any) {
        res.status(500).json({
            error: "Comment not found",
            details: error.message
        });
    }
};


const updateCommentByIdController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!id || typeof id !== "string") {
            return res.status(400).json({
                error: "Invalid or missing comment id"
            });
        }

        const comment = await CommentService.updateCommentById(id, req.body);
        return res.status(200).json({
            success: true,
            message: "Comment updated successfully",
            data: comment
        });
    } catch (error: any) {
        res.status(500).json({
            error: "Comment not found",
            details: error.message
        });
    }
};

const modarateCommentController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!id || typeof id !== "string") {
            return res.status(400).json({
                error: "Invalid or missing comment id"
            });
        }

        if (!status || typeof status !== "string") {
            return res.status(400).json({
                error: "Invalid or missing status"
            });
        }

        const comment = await CommentService.modarateComment(id, status);
        return res.status(200).json({
            success: true,
            message: "Comment status updated successfully",
            data: comment
        });
    } catch (error: any) {
        if (error.message.includes("Comment is already")) {
            return res.status(409).json({
                success: false,
                message: error.message
            });
        }
        if (error.message === "Comment not found") {
            return res.status(404).json({
                error: "Comment not found"
            });
        }
        res.status(500).json({
            error: "Failed to update comment status",
            details: error.message
        });
    }
};

export const CommentController = {
    createCommentController,
    getCommentByIdController,
    getCommentsByAuthorIDController,
    deleteCommentByIdController,
    updateCommentByIdController,
    modarateCommentController
}