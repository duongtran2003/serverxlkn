import { Router } from "express";
import { userRoute } from "./user";
import { authRouter } from "./auth";

let router = Router();

router.use('/user', userRoute);
router.use('/auth', authRouter);

export {
  router
}