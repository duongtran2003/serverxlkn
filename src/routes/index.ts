import { Router } from "express";
import { userRoute } from "./user";
import { authRouter } from "./auth";
import { actionRouter } from "./action";

let router = Router();

router.use('/user', userRoute);
router.use('/auth', authRouter);
router.use('/action', actionRouter);

export {
  router
}