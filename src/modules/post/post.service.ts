import { prisma } from "../../lib/prisma";
import { Prisma } from "../../../generated/prisma/client";

const createPost = async (data: Prisma.PostCreateInput) => {
    return await prisma.post.create({ data });
};

const deletePost = async (id: string) => {
    return await prisma.post.delete({ where: { id } });
};

export const postService = {
    createPost,
    deletePost
};
