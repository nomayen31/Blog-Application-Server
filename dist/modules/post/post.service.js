import { prisma } from "../../lib/prisma";
import { paginationHelpers } from "../../Helpers/paginationSortingHelper";
const createPost = async (data, id) => {
    const result = await prisma.post.create({
        data: {
            ...data,
            authorID: id
        }
    });
    return result;
};
const getPosts = async (payload) => {
    const { search, tags, isFeatured, status, authorId } = payload;
    const { page, limit, skip, sortBy, sortOrder } = paginationHelpers.calculatePagination(payload);
    // Build where clause dynamically with proper type safety
    const where = {};
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
    const orderBy = {};
    // Only allow sorting by specific fields to prevent errors
    const allowedSortFields = ["createdAt", "updatedAt", "title", "views"];
    if (sortBy && sortOrder && allowedSortFields.includes(sortBy)) {
        orderBy[sortBy] = sortOrder;
    }
    else {
        // Fallback to default
        orderBy.createdAt = "desc";
    }
    // Execute query with filters
    const posts = await prisma.post.findMany({
        where,
        orderBy,
        take: limit,
        skip
    });
    return posts;
};
const deletePost = async (id) => {
    const result = await prisma.post.delete({ where: { id } });
    return result;
};
export const postService = {
    createPost,
    deletePost,
    getPosts
};
//# sourceMappingURL=post.service.js.map