import { Router } from "express";
import { CouponController } from "./coupon.controller";
import { UserRole } from "../../../generated/prisma/enums";
import auth from "../../middleware/auth_middleware";

const router = Router();

router.post("/", auth(UserRole.ADMIN), CouponController.create);        // admin coupon banabe
router.get("/", CouponController.getAll); // anyone can see coupons for the home page
router.post("/validate", CouponController.validate);
router.patch("/:id", auth(UserRole.ADMIN), CouponController.update);    // admin active/inactive korbe
router.delete("/:id", auth(UserRole.ADMIN), CouponController.remove);   // admin delete korbe

export const CouponRoutes = router;