import { Router } from "express";
import { AuthController } from "../controllers/auth";

let authRouter = Router();
let authController = new AuthController();

authRouter.post('/login', authController.login);
authRouter.post('/logout', authController.logout);

export {
  authRouter
}