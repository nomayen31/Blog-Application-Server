import { Request, Response } from "express";
import { postService } from "./post.service";

const createPost = async (req: Request, res: Response) => {
    try {
        // Check if user is authenticated
        if (!req.user) {
            res.status(401).json({
                error: "Authentication required",
                details: "You must be logged in to create a post"
            });
            return;
        }

        const { title, content } = req.body;

        if (!title || !content) {
            res.status(400).json({
                error: "Validation failed",
                details: "Title and content are required"
            });
            return;
        }

        
        const result = await postService.createPost(req.body, req.user.id)
        res.status(200).send(result)
    } catch (error) {
        console.error(error);
        res.status(400).json({
            error: "Post creation failed",
            details: error instanceof Error ? error.message : "Unknown error"
        })
    }
}

const deletePost = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Post ID is required",
            });
        }

        const result = await postService.deletePost(id as string);

        return res.status(200).json({
            success: true,
            message: "Post deleted successfully",
            data: result,
        });
    } catch (error: any) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Post deletion failed",
        });
    }
};


export const postController = {
    createPost,
    deletePost
}   