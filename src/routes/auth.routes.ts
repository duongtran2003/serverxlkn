import { Router } from "express";

import { isAuthenticated } from "../guards/isAuthenticated";
import { AuthController } from "../controllers/auth.controller";

const authRouter = Router();
const authController = new AuthController();

authRouter.post('/login', authController.login);
authRouter.post('/logout', isAuthenticated, authController.logout);

export {
  authRouter
}