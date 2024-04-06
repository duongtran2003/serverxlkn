import { Router } from "express";
import { isAuthenticated } from "../guards/isAuthenticated";
import { CategoryController } from "../controllers/category";

const categoryRouter = Router();
const categoryController = new CategoryController();

categoryRouter.get('/', isAuthenticated, categoryController.index);
categoryRouter.post('/', isAuthenticated, categoryController.create);
categoryRouter.patch('/:id', isAuthenticated, categoryController.update);
categoryRouter.delete('/:id', isAuthenticated, categoryController.delete);

export {
  categoryRouter,
}
