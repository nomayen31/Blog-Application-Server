import { prisma } from "../../lib/prisma";
import { Post, Prisma, PostStatus } from "../../../generated/prisma/client";
import { paginationHelpers, IPaginationOptions } from "../../Helpers/paginationSortingHelper";

const createPost = async (data: Omit<Post, "id" | "createdAt" | "updatedAt" | "authorID">, id: string) => {
    const result = await prisma.post.create({
        data: {
            ...data,
            authorID: id
        }
    });
    return result;
};

type GetPostsPayload = {
    search?: string;
    tags?: string[];
    isFeatured?: boolean;
    status?: PostStatus;
    authorId?: string;
} & IPaginationOptions;

const getPosts = async (payload: GetPostsPayload) => {
    const { search, tags, isFeatured, status, authorId } = payload;
    const { page, limit, skip, sortBy, sortOrder } = paginationHelpers.calculatePagination(payload);

    // Build where clause dynamically with proper type safety
    const where: Prisma.PostWhereInput = {};

    // Add search filter (searches across title, content, and tags)
    if (search) {
        where.OR = [
            { title: { contains: search, mode: "insensitive" } },
            { content: { contains: search, mode: "insensitive" } },
            { tags: { has: search } },
        ];
    }

    // Add featured filter
    if (typeof isFeatured === "boolean") {
        where.isFeatured = isFeatured;
    }

    // Add tags filter (post must have ALL specified tags)
    if (tags && tags.length > 0) {
        where.tags = {
            hasEvery: tags,
        };
    }

    // Add status filter
    if (status) {
        where.status = status;
    }

    // Add authorId filter
    if (authorId) {
        where.authorID = authorId;
    }

    // Handle sorting
    const orderBy: Prisma.PostOrderByWithRelationInput = {};

    // Only allow sorting by specific fields to prevent errors
    const allowedSortFields = ["createdAt", "updatedAt", "title", "views"];
    if (sortBy && sortOrder && allowedSortFields.includes(sortBy)) {
        (orderBy as any)[sortBy] = sortOrder;
    } else {
        // Fallback to default
        orderBy.createdAt = "desc";
    }

    // Execute query with filters and get total count
    const [posts, total] = await Promise.all([
        prisma.post.findMany({
            where,
            orderBy,
            take: limit,
            skip
        }),
        prisma.post.count({ where })
    ]);

    return {
        posts,
        total,
        page,
        limit
    };
};


const getPostById = async (id: string) => {
    // First check if post exists
    const post = await prisma.post.findUnique({
        where: { id }
    });

    if (!post) {
        return null;
    }

    // Increment view count
    const updatedPost = await prisma.post.update({
        where: { id },
        data: {
            views: {
                increment: 1
            }
        }
    });

    return updatedPost;
};

const deletePost = async (id: string) => {
    const result = await prisma.post.delete({ where: { id } });
    return result;
};

export const postService = {
    createPost,
    deletePost,
    getPosts,
    getPostById
};
