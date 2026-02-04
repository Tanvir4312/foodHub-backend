import { Router } from "express";
import { customerController } from "./customer.controller";
import auth from "../../middleware/auth_middleware";
import { UserRole } from "../../../generated/prisma/enums";

const router = Router();

router.patch(
  "/customer-profile",
  auth(UserRole.CUSTOMER),
  customerController.updateCustomerProfile,
);

router.post(
  "/customer-review/:mealId",
  auth(UserRole.CUSTOMER),
  customerController.crateCustomerReview,
);

router.post(
  "/addToCart/:id",
  auth(UserRole.CUSTOMER),
  customerController.addToCart,
);

router.get(
  "/cart",
  auth(UserRole.CUSTOMER),
  customerController.getOwnCart,
);

export const customerRouter = router;
