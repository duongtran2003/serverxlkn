import { Router } from "express";
import { userRoute } from "./user";
import { authRouter } from "./auth";
import { actionRouter } from "./action";
import { requestRouter } from "./request";
import { categoryRouter } from "./category";
import { commentRouter } from "./comment";

const router = Router();

router.use('/users', userRoute);
router.use('/auth', authRouter);
router.use('/actions', actionRouter);
router.use('/requests', requestRouter);
router.use('/categories', categoryRouter);
router.use('/comments', commentRouter);

export {
  router
}