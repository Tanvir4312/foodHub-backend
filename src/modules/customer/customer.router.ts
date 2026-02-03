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

export const customerRouter = router;
