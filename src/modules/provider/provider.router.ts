import { Router } from "express";
import { providerController } from "./provider.controller";
import auth from "../../middleware/auth_middleware";

import { UserRole } from "../../../generated/prisma/enums";


const router = Router()

router.post("/provider-profile", auth(UserRole.PROVIDER), providerController.createProviderProfile)

router.post("/meals", auth(UserRole.PROVIDER), providerController.createMeals)

export const providerRouter = router

