import { Router } from "express";
import { userRoute } from "./user";
import { authRouter } from "./auth";
import { actionRouter } from "./action";
import { requestRouter } from "./request";

const router = Router();

router.use('/users', userRoute);
router.use('/auth', authRouter);
router.use('/actions', actionRouter);
router.use('/requests', requestRouter);

export {
  router
}