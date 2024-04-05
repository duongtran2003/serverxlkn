import { Router } from "express";
import { RequestController } from "../controllers/request";
import { isAuthenticated } from "../guards/isAuthenticated";


const requestRouter = Router();
const requestController = new RequestController();

requestRouter.post('/', isAuthenticated, requestController.create);
requestRouter.get('/:id?', isAuthenticated, requestController.index);

export {
  requestRouter,
}