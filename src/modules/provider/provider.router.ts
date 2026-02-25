import { Router } from "express";
import { providerController } from "./provider.controller";
import auth from "../../middleware/auth_middleware";
import { UserRole } from "../../../generated/prisma/enums";



const router = Router();

// ---Provider-----
router.post(
  "/provider-profile",
  auth(UserRole.PROVIDER),
  providerController.createProviderProfile,
);

router.put(
  "/provider-profile/:id",
  auth(UserRole.PROVIDER),
  providerController.updateProviderOwnProfile,
);

// -----Meals--------

router.get(
  "/meals/own-meals",
  auth(UserRole.PROVIDER),
  providerController.getProviderOwnMeals,
);

router.post("/meals", auth(UserRole.PROVIDER), providerController.createMeals);

router.put(
  "/meals/:id",
  auth(UserRole.PROVIDER),
  providerController.updateMeals,
);

router.delete(
  "/meals/:id",
  auth(UserRole.PROVIDER),
  providerController.deleteMeals,
);

// Stats
router.get(
  "/stats",
  auth(UserRole.PROVIDER),
  providerController.getStats,
);

export const providerRouter = router;
