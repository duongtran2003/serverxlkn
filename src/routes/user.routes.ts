import { Router } from "express";
import { UserController } from "../controllers/User.controller";
import { isAdmin } from "../guards/isAdmin";
import { isAuthenticated } from "../guards/isAuthenticated";

const userController = new UserController();
const userRoute = Router();

userRoute.post('/assign', isAuthenticated, isAdmin, userController.assignDivision.bind(userController));
userRoute.post('/remove', isAuthenticated, isAdmin, userController.removeFromDivision.bind(userController));
userRoute.post('/', isAuthenticated, isAdmin, userController.create.bind(userController));
userRoute.get('/', userController.index.bind(userController));
userRoute.put('/:id', isAuthenticated, isAdmin, userController.update.bind(userController));
userRoute.delete('/:id', isAuthenticated, isAdmin, userController.delete.bind(userController));

export {
  userRoute
}
