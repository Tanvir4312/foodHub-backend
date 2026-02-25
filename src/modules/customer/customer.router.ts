import { Router } from "express";
import { customerController } from "./customer.controller";
import auth from "../../middleware/auth_middleware";
import { UserRole } from "../../../generated/prisma/enums";

const router = Router();

router.get(
  "/customer-profile/:id",
  auth(UserRole.CUSTOMER),
  customerController.getMyCustomerProfile,
);
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

// Cart
router.get("/cart/:cartId", auth(UserRole.CUSTOMER), customerController.getCartById);






export const customerRouter = router;
