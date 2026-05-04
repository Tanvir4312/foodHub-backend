import { Router } from "express";

import auth from "../../middleware/auth_middleware";
import { UserRole } from "../../../generated/prisma/enums";
import { foodBlogsController } from "./foodBlogs.controller";

const router = Router();

router.post("/create", auth(UserRole.ADMIN), foodBlogsController.createFoodBlog)

router.get("/", foodBlogsController.getAllFoodBlog)

export const foodBlogsRouter = router;