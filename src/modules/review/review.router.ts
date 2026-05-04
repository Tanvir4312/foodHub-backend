import { Router } from "express";
import { reviewController } from "./review.controller";
import auth from "../../middleware/auth_middleware";
import { UserRole } from "../../../generated/prisma/enums";

const router = Router();

router.get(
    "/",

    reviewController.getAllReviews
)

export const reviewRouter = router;