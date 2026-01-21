import { CommentService } from "./comment.service";
import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { AppError } from "../../utils/AppError";

const createCommentController = catchAsync(async (req: Request, res: Response) => {
    try {
        const user = req.user;
        req.body.authorId = user?.id || req.body.authorId;
        const comment = await CommentService.createCommnet(req.body);
        res.status(201).json(comment);
    } catch (error: any) {
        if (error.message === "Post not found") {
            throw new AppError(404, "Post not found");
        }
        throw error;
    }
});

const getCommentByIdController = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id || typeof id !== "string") {
        throw new AppError(400, "Invalid or missing comment id");
    }

    try {
        const comment = await CommentService.getCommentById(id);
        res.status(200).json(comment);
    } catch (error: any) {
        // Service likely throws generic Error if not found, based on previous pattern
        // Or if it returns null? The controller code had try-catch so likely throws.
        // Original: res.status(500).json({ error: "Comment not found", details: error.message });
        // If it was 500 for "Comment not found", that's weird. Assuming it implies 404.
        throw new AppError(404, "Comment not found"); // Standardizing to 404 for findById
    }
});

const getCommentsByAuthorIDController = catchAsync(async (req: Request, res: Response) => {
    const { authorId } = req.params;

    if (!authorId || typeof authorId !== "string") {
        throw new AppError(400, "Invalid or missing author id");
    }

    try {
        const comments = await CommentService.getCommentsByAuthorID(authorId);
        res.status(200).json(comments);
    } catch (error: any) {
        throw new AppError(404, "Comments not found");
    }
});

const deleteCommentByIdController = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id || typeof id !== "string") {
        throw new AppError(400, "Invalid or missing comment id");
    }

    try {
        const comment = await CommentService.deleteCommentById(id);
        return res.status(200).json({
            success: true,
            message: "Comment deleted successfully",
            data: comment
        });
    } catch (error: any) {
        throw new AppError(404, "Comment not found");
    }
});


const updateCommentByIdController = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id || typeof id !== "string") {
        throw new AppError(400, "Invalid or missing comment id");
    }

    try {
        const comment = await CommentService.updateCommentById(id, req.body);
        return res.status(200).json({
            success: true,
            message: "Comment updated successfully",
            data: comment
        });
    } catch (error: any) {
        throw new AppError(404, "Comment not found");
    }
});

const modarateCommentController = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!id || typeof id !== "string") {
        throw new AppError(400, "Invalid or missing comment id");
    }

    if (!status || typeof status !== "string") {
        throw new AppError(400, "Invalid or missing status");
    }

    try {
        const comment = await CommentService.modarateComment(id, status);
        return res.status(200).json({
            success: true,
            message: "Comment status updated successfully",
            data: comment
        });
    } catch (error: any) {
        if (error.message.includes("Comment is already")) {
            throw new AppError(409, error.message);
        }
        if (error.message === "Comment not found") {
            throw new AppError(404, "Comment not found");
        }
        throw error;
    }
});

export const CommentController = {
    createCommentController,
    getCommentByIdController,
    getCommentsByAuthorIDController,
    deleteCommentByIdController,
    updateCommentByIdController,
    modarateCommentController
}
