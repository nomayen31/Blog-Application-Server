import { prisma } from "../../lib/prisma";
import { Post, Prisma } from "../../../generated/prisma/client";

const createPost = async (data: Omit<Post, "id" | "createdAt" | "updatedAt" | "authorID">, id: string) => {
    const result = await prisma.post.create({ 
        data :{
            ...data,
            authorID: id
        }
     });
    return result;
};

const getPosts = async () => {
    const result = await prisma.post.findMany();
    return result;
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
