import { Router, request } from "express";
import { RequestController } from "../controllers/Request.controller";
import { isAuthenticated } from "../guards/isAuthenticated";

const requestRouter = Router();
const requestController = new RequestController();

requestRouter.post('/forward/:id', isAuthenticated, requestController.forward.bind(requestController));
requestRouter.post('/disapprove/:id', isAuthenticated, requestController.disapprove.bind(requestController));
requestRouter.post('/approve/:id', isAuthenticated, requestController.approve.bind(requestController));
requestRouter.post('/', isAuthenticated, requestController.create.bind(requestController));
requestRouter.get('/viewHistory/:id', isAuthenticated, requestController.viewHistory.bind(requestController));
requestRouter.get('/:id?', isAuthenticated, requestController.index.bind(requestController));
requestRouter.delete('/:id', isAuthenticated, requestController.delete.bind(requestController));
requestRouter.put('/:id', isAuthenticated, requestController.update.bind(requestController));

export {
  requestRouter,
}
