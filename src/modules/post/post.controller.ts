import { Request, Response } from "express";
import { postService } from "./post.service";
import { PostStatus } from "../../../generated/prisma/client";
import catchAsync from "../../utils/catchAsync";
import { AppError } from "../../utils/AppError";

const createPost = catchAsync(async (req: Request, res: Response) => {
    // Check if user is authenticated
    if (!req.user) {
        throw new AppError(401, "Authentication required");
        // details: "You must be logged in to create a post" - message covers it
    }

    const { title, content } = req.body;

    if (!title || !content) {
        throw new AppError(400, "Validation failed: Title and content are required");
    }
    const result = await postService.createPost(req.body, req.user.id)
    res.status(200).send(result)
});

const getPosts = catchAsync(async (req: Request, res: Response) => {
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

    res.status(200).json({
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
});


const getPostById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) {
        throw new AppError(400, "Post ID is required");
    }

    const post = await postService.getPostById(id as string);

    if (!post) {
        throw new AppError(404, "Post not found");
    }

    res.status(200).json({
        success: true,
        message: "Post retrieved successfully",
        data: post,
    });
});


const deletePost = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) {
        throw new AppError(400, "Post ID is required");
    }

    const result = await postService.deletePost(id as string);

    res.status(200).json({
        success: true,
        message: "Post deleted successfully",
        data: result,
    });
});


const getMyPosts = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) {
        throw new AppError(401, "Authentication required");
    }

    // Check user status
    if (req.user.status !== "ACTIVE") {
        throw new AppError(403, "Access denied: Your account is not active");
    }

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

    const page = req.query.page ? Number(req.query.page) : undefined;
    const limit = req.query.limit ? Number(req.query.limit) : undefined;
    const sortBy = req.query.sortBy as string | undefined;
    const sortOrder = req.query.sortOrder as string | undefined;

    // Force authorId to be the current user
    const authorId = req.user.id;

    const payload = {
        ...(search && { search }),
        ...(tags && { tags }),
        ...(isFeatured !== undefined && { isFeatured }),
        ...(status && { status }),
        ...(page && { page }),
        ...(limit && { limit }),
        ...(sortBy && { sortBy }),
        ...(sortOrder && { sortOrder }),
        authorId
    };

    const result = await postService.getPosts(payload);

    res.status(200).json({
        success: true,
        message: "My posts retrieved successfully",
        data: {
            items: result.posts,
            pagination: {
                page: result.page,
                limit: result.limit,
                total: result.total,
                totalPages: Math.ceil(result.total / result.limit)
            }
        }
    });
});

const updatePost = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const updateData = req.body;

    if (!req.user) {
        throw new AppError(401, "Authentication required");
    }

    if (!id) {
        throw new AppError(400, "Post ID is required");
    }

    try {
        const result = await postService.updatePost(id as string, updateData, req.user.id);

        res.status(200).json({
            success: true,
            message: "Post updated successfully",
            data: result
        });
    } catch (error: any) {
        // Handle specific errors thrown by service if not yet refactored to AppError
        if (error.message.includes("Unauthorized")) {
            throw new AppError(403, error.message);
        }
        if (error.message.includes("Post not found")) {
            throw new AppError(404, error.message);
        }
        throw error; // Let global handler handle "Unknown error" as 500
    }
});

const getStats = catchAsync(async (req: Request, res: Response) => {
    const result = await postService.getStats();
    res.status(200).json({
        success: true,
        message: "Stats retrieved successfully",
        data: result
    });
});

export const postController = {
    createPost,
    updatePost,
    deletePost,
    getPosts,
    getPostById,
    getMyPosts,
    getStats
}
