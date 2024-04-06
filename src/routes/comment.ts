import { Router } from "express";
import { CommentController } from "../controllers/comment";
import { isAuthenticated } from "../guards/isAuthenticated";

const commentRouter = Router();
const commentController = new CommentController();

commentRouter.get('/', isAuthenticated, commentController.index);
commentRouter.post('/', isAuthenticated, commentController.create);
commentRouter.patch('/:id', isAuthenticated, commentController.update);
commentRouter.delete('/:id', isAuthenticated, commentController.delete);

export {
  commentRouter,
}
