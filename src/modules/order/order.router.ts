import { Router } from "express";
import auth from "../../middleware/auth_middleware";
import { UserRole } from "../../../generated/prisma/enums";
import { orderController } from "./order.controller";

const router = Router()

router.post("/orders", auth(UserRole.CUSTOMER), orderController.createOrder)


export const orderRouter = router