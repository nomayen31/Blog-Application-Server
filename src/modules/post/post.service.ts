import { prisma } from "../../lib/prisma";
import { Post, Prisma } from "../../../generated/prisma/client";

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
};

const getPosts = async (payload: GetPostsPayload) => {
  const { search, tags } = payload;

  const where: Prisma.PostWhereInput = {
    ...(search && {
      OR: [
        { title: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
        { tags: { has: search } } // for String[] tags
      ]
    }),

    ...(tags && {
      tags: {
        hasEvery: tags
      }
    })
  };

  const posts = await prisma.post.findMany({
    where,
    orderBy: { createdAt: "desc" }
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
