import { Router } from "express";
import { reviewController } from "./review.controller";
import auth from "../../middleware/auth_middleware";
import { UserRole } from "../../../generated/prisma/enums";

const router = Router();

router.get(
    "/",

    reviewController.getAllReviews
)

router.get(
    "/my-reviews",
    auth(UserRole.CUSTOMER),
    reviewController.getMyReviews
)

export const reviewRouter = router;