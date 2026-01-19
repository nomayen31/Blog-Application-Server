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
            skip,
            include: {
                _count: {
                    select: {
                        Comment: true
                    }
                }
            }
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


const buildCommentTree = (comments: any[]) => {
    const commentMap: { [key: string]: any } = {};
    const rootComments: any[] = [];

    // Initialize map with empty replies array
    comments.forEach(comment => {
        commentMap[comment.id] = { ...comment, replies: [] };
    });

    // Build tree
    comments.forEach(comment => {
        if (comment.parentId) {
            if (commentMap[comment.parentId]) {
                commentMap[comment.parentId].replies.push(commentMap[comment.id]);
            }
        } else {
            rootComments.push(commentMap[comment.id]);
        }
    });

    // Add replyCount and sort replies ASC (Oldest First)
    Object.keys(commentMap).forEach(key => {
        const comment = commentMap[key];
        comment.replyCount = comment.replies.length;

        // Sort replies by createdAt ASC
        comment.replies.sort((a: any, b: any) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
    });

    // Sort root comments by createdAt DESC (Newest First)
    rootComments.sort((a: any, b: any) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return rootComments;
};

const getPostById = async (id: string) => {
    // Increment view count
    await prisma.post.updateMany({
        where: { id },
        data: { views: { increment: 1 } }
    }).catch(() => { });

    // Fetch Post
    const post = await prisma.post.findUnique({
        where: { id }
    });

    if (!post) {
        return null;
    }

    // Fetch all APPROVED comments for this post
    // Fetching ASC helps with chronological processing, but our in-memory sort handles final order
    const allComments = await prisma.comment.findMany({
        where: {
            postId: id,
            Status: "APPROVED"
        },
        orderBy: { createdAt: 'asc' }
    });

    // Build nested structure
    const commentTree = buildCommentTree(allComments);

    // Calculate counts
    const totalComments = allComments.length;
    const totalReplies = allComments.filter(c => c.parentId !== null).length;
    const totalRootComments = allComments.filter(c => c.parentId === null).length;

    return {
        ...post,
        totalComments,
        totalReplies,
        totalRootComments,
        comments: commentTree
    };
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
