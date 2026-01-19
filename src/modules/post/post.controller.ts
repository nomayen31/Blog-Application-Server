import { Request, Response } from "express";
import { postService } from "./post.service";
import { PostStatus } from "../../../generated/prisma/client";

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

const getPosts = async (req: Request, res: Response) => {
    try {
        const search =
            typeof req.query.search === "string"
                ? req.query.search.trim()
                : undefined;

        const tags =
            typeof req.query.tags === "string"
                ? req.query.tags.split(",").map(t => t.trim())
                : undefined;

        const isFeatured = req.query.isFeatured === "true" ? true : req.query.isFeatured === "false" ? false : undefined;

        const statusParam = req.query.status as string | undefined;
        // Validate status against enum
        const status = statusParam && Object.values(PostStatus).includes(statusParam as PostStatus)
            ? (statusParam as PostStatus)
            : undefined;

        const authorId = typeof req.query.authorId === "string" ? req.query.authorId.trim() : undefined;

        const page = req.query.page ? Number(req.query.page) : undefined;
        const limit = req.query.limit ? Number(req.query.limit) : undefined;
        const sortBy = req.query.sortBy as string | undefined;
        const sortOrder = req.query.sortOrder as string | undefined;

        // Build payload safely (exactOptionalPropertyTypes friendly)
        const payload = {
            ...(search && { search }),
            ...(tags && { tags }),
            ...(isFeatured !== undefined && { isFeatured }),
            ...(status && { status }),
            ...(authorId && { authorId }),
            ...(page && { page }),
            ...(limit && { limit }),
            ...(sortBy && { sortBy }),
            ...(sortOrder && { sortOrder })
        };

        const result = await postService.getPosts(payload);

        return res.status(200).json({
            success: true,
            message: search
                ? `Found ${result.total} post(s) matching "${search}"`
                : "Posts retrieved successfully",
            data: {
                items: result.posts,
                pagination: {
                    page: result.page,
                    limit: result.limit,
                    total: result.total,
                    totalPages: Math.ceil(result.total / result.limit)
                },
                searchQuery: search ?? null,
                tags: tags ?? []
            }
        });
    } catch (error) {
        console.error("Error fetching posts:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to retrieve posts",
            error: error instanceof Error ? error.message : "Unexpected server error"
        });
    }
};


const getPostById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Post ID is required",
            });
        }

        const post = await postService.getPostById(id);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Post retrieved successfully",
            data: post,
        });
    } catch (error) {
        console.error("Error fetching post:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to retrieve post",
            error: error instanceof Error ? error.message : "Unexpected server error"
        });
    }
};


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
    deletePost,
    getPosts,
    getPostById
}   