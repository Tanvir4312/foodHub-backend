import { Router } from "express";
import { adminController } from "./admin.controller";
import auth from "../../middleware/auth_middleware";
import { UserRole } from "../../enum/userRole";

const router = Router();
// Users
router.get("/users", auth(UserRole.ADMIN), adminController.getAllUser);

router.patch("/users/:id", auth(UserRole.ADMIN), adminController.updateUserStatus);
// --------Categories----------------
router.get("/categories", auth(UserRole.ADMIN), adminController.getAllCategory);

router.post("/categories", auth(UserRole.ADMIN), adminController.createCategories);

router.patch("/categories/:id", auth(UserRole.ADMIN), adminController.updateCategories);


export const adminRouter = router;
