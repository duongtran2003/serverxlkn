import { Router } from "express";
import { UserController } from "../controllers/User.controller";
import { isAdmin } from "../guards/isAdmin";
import { isAuthenticated } from "../guards/isAuthenticated";

const userController = new UserController();
const userRoute = Router();

userRoute.post('/assign', isAuthenticated, isAdmin, userController.assignDivision);
userRoute.post('/remove', isAuthenticated, isAdmin, userController.removeFromDivision);
userRoute.post('/', isAuthenticated, isAdmin, userController.create);
userRoute.get('/', userController.index);
userRoute.patch('/:id', isAuthenticated, isAdmin, userController.update);
userRoute.delete('/:id', isAuthenticated, isAdmin, userController.delete);

export {
  userRoute
}
