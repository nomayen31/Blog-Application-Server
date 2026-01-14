import { postService } from "./post.service";
const createPost = async (req, res) => {
    try {
        const { title, content, authorID } = req.body;
        if (!title || !content || !authorID) {
            res.status(400).json({
                error: "Validation failed",
                details: "Title, content, and authorID are required"
            });
            return;
        }
        const result = await postService.createPost(req.body);
        res.status(200).send(result);
    }
    catch (error) {
        console.error(error);
        res.status(400).json({
            error: "Post creation failed",
            details: error instanceof Error ? error.message : "Unknown error"
        });
    }
};
const deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Post ID is required",
            });
        }
        const result = await postService.deletePost(id);
        return res.status(200).json({
            success: true,
            message: "Post deleted successfully",
            data: result,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Post deletion failed",
        });
    }
};
export const postController = {
    createPost,
    deletePost
};
//# sourceMappingURL=post.controller.js.map