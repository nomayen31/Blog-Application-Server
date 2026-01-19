import { Post, PostStatus } from "../../../generated/prisma/client";
import { IPaginationOptions } from "../../Helpers/paginationSortingHelper";
type GetPostsPayload = {
    search?: string;
    tags?: string[];
    isFeatured?: boolean;
    status?: PostStatus;
    authorId?: string;
} & IPaginationOptions;
export declare const postService: {
    createPost: (data: Omit<Post, "id" | "createdAt" | "updatedAt" | "authorID">, id: string) => Promise<{
        createdAt: Date;
        id: string;
        title: string;
        content: string;
        thumbail: string | null;
        isFeatured: boolean;
        status: import("../../../generated/prisma/client").$Enums.PostStatus;
        tags: string[];
        views: number;
        authorID: string;
        updatedAt: Date;
    }>;
    deletePost: (id: string) => Promise<{
        createdAt: Date;
        id: string;
        title: string;
        content: string;
        thumbail: string | null;
        isFeatured: boolean;
        status: import("../../../generated/prisma/client").$Enums.PostStatus;
        tags: string[];
        views: number;
        authorID: string;
        updatedAt: Date;
    }>;
    getPosts: (payload: GetPostsPayload) => Promise<{
        createdAt: Date;
        id: string;
        title: string;
        content: string;
        thumbail: string | null;
        isFeatured: boolean;
        status: import("../../../generated/prisma/client").$Enums.PostStatus;
        tags: string[];
        views: number;
        authorID: string;
        updatedAt: Date;
    }[]>;
};
export {};
//# sourceMappingURL=post.service.d.ts.map