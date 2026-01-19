import { Request, Response } from "express";
export declare const postController: {
    createPost: (req: Request, res: Response) => Promise<void>;
    deletePost: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    getPosts: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
};
//# sourceMappingURL=post.controller.d.ts.map