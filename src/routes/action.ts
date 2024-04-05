import { Router } from "express";
import { ActionController } from "../controllers/action";
import { isAuthenticated } from "../guards/isAuthenticated";
import { isAdmin } from "../guards/isAdmin";

const actionRouter = Router();

const actionController = new ActionController();

actionRouter.post('/create', isAuthenticated, isAdmin, actionController.create);

export {
  actionRouter,
}