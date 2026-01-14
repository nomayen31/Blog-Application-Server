import { prisma } from "../../lib/prisma";
const createPost = async (data) => {
    return await prisma.post.create({ data });
};
const deletePost = async (id) => {
    return await prisma.post.delete({ where: { id } });
};
export const postService = {
    createPost,
    deletePost
};
//# sourceMappingURL=post.service.js.map