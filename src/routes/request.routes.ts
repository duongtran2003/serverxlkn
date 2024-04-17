import { Router } from "express";
import { RequestController } from "../controllers/Request.Controller";
import { isAuthenticated } from "../guards/isAuthenticated";


const requestRouter = Router();
const requestController = new RequestController();

requestRouter.post('/forward/:id', isAuthenticated, requestController.forward);
requestRouter.post('/disapprove/:id', isAuthenticated, requestController.disapprove);
requestRouter.post('/approve/:id', isAuthenticated, requestController.approve);
requestRouter.post('/', isAuthenticated, requestController.create);
requestRouter.get('/:id?', isAuthenticated, requestController.index);
requestRouter.delete('/:id', isAuthenticated, requestController.delete);


export {
  requestRouter,
}
