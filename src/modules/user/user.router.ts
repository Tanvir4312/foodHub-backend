import { Router } from "express";
import auth from "../../middleware/auth_middleware";
import { userController } from "./user.controller";

const router = Router()

router.get("/user", auth(), userController.getOwnUserData)

export const userRouter = router