import { Router } from "express";
import { adminController } from "./admin.controller";
import auth from "../../middleware/auth_middleware";
import { UserRole } from "../../enum/userRole";

const router = Router();

router.get("/users", auth(UserRole.ADMIN), adminController.getAllUser);

router.post("/categories", auth(UserRole.ADMIN), adminController.createCategories);

router.patch("/users/:id", auth(UserRole.ADMIN), adminController.updateUserStatus);

export const adminRouter = router;
