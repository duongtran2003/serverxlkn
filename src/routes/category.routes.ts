import { Router } from "express";
import { isAuthenticated } from "../guards/isAuthenticated";
import { isAdmin } from "../guards/isAdmin";
import { CategoryController } from "../controllers/category.controller";

const categoryRouter = Router();
const categoryController = new CategoryController();

categoryRouter.get('/:id?', isAuthenticated, categoryController.index);
categoryRouter.post('/', isAuthenticated, categoryController.create);
categoryRouter.patch('/:id', isAuthenticated, isAdmin, categoryController.update);
categoryRouter.delete('/:id', isAuthenticated, isAdmin, categoryController.delete);

export {
  categoryRouter,
}
