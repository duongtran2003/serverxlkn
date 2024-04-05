import { Router } from "express";
import { UserController } from "../controllers/user";
import { isAdmin } from "../guards/isAdmin";
import { isAuthenticated } from "../guards/isAuthenticated";

const userController = new UserController();
const userRoute = Router();

userRoute.post('/register', isAuthenticated, isAdmin, userController.create);
userRoute.get('/', userController.index);
userRoute.patch('/update/:id', isAuthenticated, isAdmin, userController.update);
userRoute.post('/delete/:id', isAuthenticated, isAdmin, userController.delete);

export {
  userRoute
}
