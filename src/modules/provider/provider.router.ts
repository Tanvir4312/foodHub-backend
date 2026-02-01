import { Router } from "express";
import { providerController } from "./provider.controller";
import auth from "../../middleware/auth_middleware";
import { role } from "better-auth/plugins";
import { UserRole } from "../../../generated/prisma/enums";


const router = Router()

router.post("/provider-profile", auth(UserRole.PROVIDER), providerController.createProviderProfile)

export const providerRouter = router

