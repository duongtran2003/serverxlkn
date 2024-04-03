import { Router } from "express";
import { UserController } from "../controllers/user";

const userController = new UserController();
const userRoute = Router();

userRoute.post('/register', userController.register);
userRoute.get('/index', userController.index);

export {
  userRoute
}
