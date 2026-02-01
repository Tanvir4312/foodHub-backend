import { Router } from "express";
import { providerController } from "./provider.controller";
import auth from "../../middleware/auth_middleware";

import { UserRole } from "../../../generated/prisma/enums";

const router = Router();

router.post(
  "/provider-profile",
  auth(UserRole.PROVIDER),
  providerController.createProviderProfile,
);

router.get("/meals",  providerController.getAllMeal);

router.post("/meals", auth(UserRole.PROVIDER), providerController.createMeals);

router.put("/meals/:id", auth(UserRole.PROVIDER), providerController.updateMeals);

export const providerRouter = router;
