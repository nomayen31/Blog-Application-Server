import { CommentStatus } from "../../../generated/prisma/client"
import { prisma } from "../../lib/prisma"

const createCommnet = async (payload: {
    content: string,
    authorId: string,
    postId: string,
    parentId?: string
}) => {
    await prisma.post.findUniqueOrThrow({
        where: {
            id: payload.postId
        }
    })
    if (payload.parentId) {
        await prisma.comment.findUniqueOrThrow({
            where: {
                id: payload.parentId
            }
        })
    }
    const result = await prisma.comment.create({
        data: payload
    })
    return result;
}

const getCommentById = async (id: string) => {
    const result = await prisma.comment.findUniqueOrThrow({
        where: {
            id
        },
        include: {
            post: {
                select: {
                    id: true,
                    title: true,
                    views: true,
                }
            }
        }
    })
    return result;
}

const getCommentsByAuthorID = async (authorId: string) => {
    const result = await prisma.comment.findMany({
        where: {
            authorId
        },
        orderBy: {
            createdAt: "desc"
        },
        include: {
            post: {
                select: {
                    id: true,
                    title: true,
                    views: true,
                }
            }
        }
    })
    return result;
}

const deleteCommentById = async (id: string) => {
    const result = await prisma.comment.delete({
        where: {
            id
        }
    })
    return result;
}

const updateCommentById = async (id: string, payload: {
    content: string,
    authorId: string,
    postId: string,
    parentId?: string
}) => {
    const result = await prisma.comment.update({
        where: {
            id
        },
        data: payload
    })
    return result;
}

const modarateComment = async (id: string, status: string) => {
    // Validate status (basic check, though Prisma handles type mismatch error)
    // Assuming status is passed as a string like "APPROVED" | "REJECT"

    const existComment = await prisma.comment.findUnique({
        where: {
            id
        }
    })

    if (!existComment) {
        throw new Error("Comment not found")
    }

    if (existComment.Status === status) {
        throw new Error(`Comment is already ${status}`)
    }

    const result = await prisma.comment.update({
        where: {
            id
        },
        data: {
            Status: status as CommentStatus
        }
    })
    return result;
}


export const CommentService = {
    createCommnet,
    getCommentById,
    getCommentsByAuthorID,
    deleteCommentById,
    updateCommentById,
    modarateComment
}


