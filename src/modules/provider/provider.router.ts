import { Router } from "express";
import { providerController } from "./provider.controller";
import auth from "../../middleware/auth_middleware";
import { UserRole } from "../../../generated/prisma/enums";

// import { UserRole } from "../../../generated/prisma/enums";

const router = Router();

// ---Provider-----
router.get("/providers", providerController.getAllProvider)

router.get("/providers/:id", providerController.getProviderById)

router.post(
  "/provider-profile",
  auth(UserRole.PROVIDER),
  providerController.createProviderProfile,
);

// -----Meals--------
router.get("/meals",  providerController.getAllMeal);

router.get("/meals/own-meals", auth(UserRole.PROVIDER),  providerController.getProviderOwnMeals);

router.get("/meals/:id",  providerController.getMealsById);

router.post("/meals", auth(UserRole.PROVIDER), providerController.createMeals);

router.put("/meals/:id", auth(UserRole.PROVIDER), providerController.updateMeals);

router.delete("/meals/:id", auth(UserRole.PROVIDER), providerController.deleteMeals);



export const providerRouter = router;
