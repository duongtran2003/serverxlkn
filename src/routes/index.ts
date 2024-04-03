import { Router } from "express";
import { userRoute } from "./user";

let router = Router();

router.use('/user', userRoute);

export {
  router
}