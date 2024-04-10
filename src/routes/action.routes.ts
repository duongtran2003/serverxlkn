import { Router } from "express";
import { isAuthenticated } from "../guards/isAuthenticated";
import { isAdmin } from "../guards/isAdmin";
import { ActionController } from "../controllers/Action.controller";

const actionRouter = Router();
const actionController = new ActionController();

actionRouter.post('/', isAuthenticated, isAdmin, actionController.create);
actionRouter.get('/:id?', isAuthenticated, actionController.index);

export {
  actionRouter,
}