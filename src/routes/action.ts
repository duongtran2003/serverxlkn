import { Router } from "express";
import { ActionController } from "../controllers/action";
import { isAuthenticated } from "../guards/isAuthenticated";
import { isAdmin } from "../guards/isAdmin";

const actionRouter = Router();
const actionController = new ActionController();

actionRouter.post('/', isAuthenticated, isAdmin, actionController.create);
actionRouter.get('/:id?', isAuthenticated, actionController.index);

export {
  actionRouter,
}