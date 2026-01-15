import { prisma } from "../../lib/prisma";
import { Post, Prisma, PostStatus } from "../../../generated/prisma/client";

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
};

const getPosts = async (payload: GetPostsPayload) => {
    const { search, tags, isFeatured, status, authorId } = payload;

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

    // Execute query with filters
    const posts = await prisma.post.findMany({
        where,
        orderBy: { createdAt: "desc" },
    });

    return posts;
};


const deletePost = async (id: string) => {
    const result = await prisma.post.delete({ where: { id } });
    return result;
};

export const postService = {
    createPost,
    deletePost,
    getPosts
};
