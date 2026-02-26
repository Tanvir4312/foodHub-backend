import { Router } from "express";
import { publicController } from "./public.controller";
import auth from "../../middleware/auth_middleware";

const router = Router();

// Category
router.get("/categories", publicController.getAllCategory);

router.get("/categories/:id", publicController.getCategoryById);

// Meals
router.get("/meals", publicController.getAllMeal);

router.get("/top-meals", publicController.getAllTopMeal);

router.get("/meals/:id", publicController.getMealsById);

// Providers
router.get("/providers", publicController.getAllProvider);

router.get("/providers/:id", publicController.getProviderById);

// AddToCart
router.post("/addToCart", auth(), publicController.addToCart);

router.get("/carts", auth(), publicController.getOwnCart);

router.get("/cart/count", auth(), publicController.getOwnCartCount);

router.delete("/cart/:cartId", publicController.cartDelete);

router.delete("/cartItem/:itemsId", publicController.itemDelete);

export const publicRouter = router;
