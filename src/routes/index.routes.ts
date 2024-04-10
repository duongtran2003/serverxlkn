import { Router } from "express";
import { userRoute } from "./user.routes";
import { authRouter } from "./auth.routes";
import { actionRouter } from "./action.routes";
import { requestRouter } from "./request.routes";
import { categoryRouter } from "./category.routes";
import { commentRouter } from "./comment.routes";
import { divisionRouter } from "./division.routes";

const router = Router();

router.use('/users', userRoute);
router.use('/auth', authRouter);
router.use('/actions', actionRouter);
router.use('/requests', requestRouter);
router.use('/categories', categoryRouter);
router.use('/comments', commentRouter);
router.use('/divisions', divisionRouter);

export {
  router
}