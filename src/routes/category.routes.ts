import { Router } from "express";
import { isAuthenticated } from "../guards/isAuthenticated";
import { isAdmin } from "../guards/isAdmin";
import { CategoryController } from "../controllers/Category.controller";

const categoryRouter = Router();
const categoryController = new CategoryController();

categoryRouter.get('/:id?', isAuthenticated, categoryController.index.bind(categoryController));
categoryRouter.post('/', isAuthenticated, categoryController.create.bind(categoryController));
categoryRouter.put('/:id', isAuthenticated, isAdmin, categoryController.update.bind(categoryController));
categoryRouter.delete('/:id', isAuthenticated, isAdmin, categoryController.delete.bind(categoryController));

export {
  categoryRouter,
}
