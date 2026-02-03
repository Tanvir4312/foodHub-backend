import { Router } from "express";
import auth from "../../middleware/auth_middleware";
import { UserRole } from "../../../generated/prisma/enums";
import { orderController } from "./order.controller";

const router = Router()

router.get("/orders", auth(UserRole.CUSTOMER), orderController.getUserOwnOrder)

router.get("/orders/:id", auth(UserRole.CUSTOMER), orderController.getOrderById)

router.get("/incoming-orders", auth(UserRole.PROVIDER), orderController.getIncomingOrder)

router.post("/orders", auth(UserRole.CUSTOMER), orderController.createOrder)

router.patch("/orders/:id", auth(UserRole.PROVIDER), orderController.updateOrderStatus)







export const orderRouter = router