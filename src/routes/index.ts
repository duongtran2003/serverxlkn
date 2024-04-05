import { Router } from "express";
import { userRoute } from "./user";
import { authRouter } from "./auth";
import { actionRouter } from "./action";

let router = Router();

router.use('/users', userRoute);
router.use('/auth', authRouter);
router.use('/actions', actionRouter);

export {
  router
}