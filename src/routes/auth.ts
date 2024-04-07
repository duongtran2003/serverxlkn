import { Router } from "express";
import { AuthController } from "../controllers/auth";
import { isAuthenticated } from "../guards/isAuthenticated";

const authRouter = Router();
const authController = new AuthController();

authRouter.post('/login', authController.login);
authRouter.post('/logout', isAuthenticated, authController.logout);

export {
  authRouter
}