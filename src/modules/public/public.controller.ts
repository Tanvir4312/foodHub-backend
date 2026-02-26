import { Request, Response } from "express";
import { publicServices } from "./public.services";
import { paginationHelper } from "../../helper/paginationHelper";
import { number } from "better-auth";

// Category
const getAllCategory = async (req: Request, res: Response) => {
  try {
    const result = await publicServices.getAllCategory();
    res.status(200).json(result);
  } catch (e: any) {
    res.status(404).json({
      message: e.message || "An unexpected error occurred",
    });
  }
};

const getCategoryById = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const result = await publicServices.getCategoryById(id as string);
    res.status(200).json(result);
  } catch (e: any) {
    res.status(404).json({
      message: e.message || "An unexpected error occurred",
    });
  }
};

// Meals
const getAllMeal = async (req: Request, res: Response) => {
  const search = req.query.search;
  const dietaryParams = req.query.dietary;
  const minPriceStr = req.query.minPrice;
  const maxPriceStr = req.query.maxPrice;

  const minPrice = Number(minPriceStr);
  const maxPrice = Number(maxPriceStr);

  const { page, limit, skip } = paginationHelper(req.query);

  try {
    const allmeal = await publicServices.getAllMeal(
      search as string,
      dietaryParams as string,
      minPrice as number,
      maxPrice as number,
      page,
      limit,
      skip,
    );
    res.status(200).json(allmeal);
  } catch (e: any) {
    res.status(404).json({
      message: e.message || "An unexpected error occurred",
    });
  }
};

const getAllTopMeal = async (req: Request, res: Response) => {
  try {
    const topMeals = await publicServices.getAllTopMeal();
    res.status(200).json(topMeals);
  } catch (e: any) {
    res.status(404).json({
      message: e.message || "An unexpected error occurred",
    });
  }
};

const getMealsById = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    const mealDetails = await publicServices.getMealsById(id as string);
    res.status(200).json(mealDetails);
  } catch (e: any) {
    res.status(404).json({
      message: e.message || "An unexpected error occurred",
    });
  }
};

// Provider
const getAllProvider = async (req: Request, res: Response) => {
  try {
    const allProvider = await publicServices.getAllProvider();
    res.status(200).json(allProvider);
  } catch (e) {
    res.status(404).json({
      message: "Provider not found",
      error: e,
    });
  }
};

const getProviderById = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const getSpecificProvider = await publicServices.getProviderById(
      id as string,
    );
    res.status(200).json(getSpecificProvider);
  } catch (e) {
    res.status(404).json({
      message: "Provider not found",
      error: e,
    });
  }
};

// AddToCart
const addToCart = async (req: Request, res: Response) => {
  const id = req.user?.id;
  const { quantity, price, mealId } = req.body;

  try {
    const result = await publicServices.addToCart(
      id as string,
      mealId as string,
      quantity,
      price,
    );

    res.status(200).json(result);
  } catch (e: any) {
    res.status(400).json({
      message: e.message || "An unexpected error occurred",
    });
  }
};

const getOwnCart = async (req: Request, res: Response) => {
  const id = req.user?.id;

  try {
    const result = await publicServices.getOwnCart(id as string);

    res.status(200).json(result);
  } catch (e: any) {
    res.status(400).json({
      message: e.message || "An unexpected error occurred",
    });
  }
};

const getOwnCartCount = async (req: Request, res: Response) => {
  const id = req.user?.id;

  try {
    const result = await publicServices.getOwnCartCount(id as string);

    res.status(200).json(result);
  } catch (e: any) {
    res.status(400).json({
      message: e.message || "An unexpected error occurred",
    });
  }
};

const cartDelete = async (req: Request, res: Response) => {

  const cartId = req.params.cartId;
  try {
    const result = await publicServices.cartDelete(

      cartId as string,
    );

    res.status(200).json(result);
  } catch (e: any) {
    res.status(400).json({
      message: e.message || "An unexpected error occurred",
    });
  }
};

const itemDelete = async (req: Request, res: Response) => {

  const itemsId = req.params.itemsId;
  try {
    const result = await publicServices.itemDelete(

      itemsId as string,
    );

    res.status(200).json(result);
  } catch (e: any) {
    res.status(400).json({
      message: e.message || "An unexpected error occurred",
    });
  }
};

export const publicController = {
  getAllCategory,
  getCategoryById,
  getAllMeal,
  getAllTopMeal,
  getAllProvider,
  getProviderById,
  getMealsById,
  addToCart,
  getOwnCart,
  getOwnCartCount,
  cartDelete,
  itemDelete
};
