import { Prisma } from "../../../generated/prisma/client";
export declare const postService: {
    createPost: (data: Prisma.PostCreateInput) => Promise<{
        id: string;
        title: string;
        content: string;
        thumbail: string | null;
        isFeatured: boolean;
        status: import("../../../generated/prisma/client").$Enums.PostStatus;
        tags: string[];
        views: number;
        authorID: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    deletePost: (id: string) => Promise<{
        id: string;
        title: string;
        content: string;
        thumbail: string | null;
        isFeatured: boolean;
        status: import("../../../generated/prisma/client").$Enums.PostStatus;
        tags: string[];
        views: number;
        authorID: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
};
//# sourceMappingURL=post.service.d.ts.map