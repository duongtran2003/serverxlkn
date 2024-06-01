import { Router } from "express";

import { isAuthenticated } from "../guards/isAuthenticated";
import { AuthController } from "../controllers/Auth.controller";


const authRouter = Router();
const authController = new AuthController();

authRouter.post('/login', authController.login.bind(authController));
authRouter.post('/logout', isAuthenticated, authController.logout.bind(authController));

export {
  authRouter
}
