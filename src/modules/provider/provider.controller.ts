import { NextFunction, Request, Response } from "express";
import { providerServices } from "./provider.service";

// ------Provider-------
const createProviderProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const id = req.user?.id;
  if (!id) {
    return res.status(400).json({ message: "user not found" });
  }

  try {
    const providerProfileCreate = await providerServices.createProviderProfile(
      req.body,
      id,
    );
    res.status(200).json(providerProfileCreate);
  } catch (e) {
    next(e);
  }
};
const getAllProvider = async (req: Request, res: Response) => {
  try {
    const allProvider = await providerServices.getAllProvider();
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
    const getSpecificProvider = await providerServices.getProviderById(
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
// -------Meals------------
const getAllMeal = async (req: Request, res: Response) => {
  const search = req.query.search;
  const minPriceStr = req.query.minPrice;
  const maxPriceStr = req.query.maxPrice;

  const minPrice = Number(minPriceStr);
  const maxPrice = Number(maxPriceStr);

  try {
    const mealsCreate = await providerServices.getAllMeal(
      search as string,
      minPrice as number,
      maxPrice as number,
    );
    res.status(200).json(mealsCreate);
  } catch (e) {
    res.status(404).json({
      message: "Meal not found",
      error: e,
    });
  }
};

const getProviderOwnMeals = async(req: Request, res: Response)=>{
  const userId = req.user?.id
try {
    const providerOwnMeal = await providerServices.getProviderOwnMeals(userId as string);
    res.status(200).json(providerOwnMeal);
  } catch (e) {
    res.status(404).json({
      message: "Meal not found",
      error: e,
    });
  }
}

const getMealsById = async (req: Request, res: Response) => {
  const id = req.params.id;
  console.log(id);
  try {
    const mealDetails = await providerServices.getMealsById(id as string);
    res.status(200).json(mealDetails);
  } catch (e) {
    res.status(404).json({
      message: "Meal not found",
      error: e,
    });
  }
};
const createMeals = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const mealsCreate = await providerServices.createMeals(req.body);
    res.status(200).json(mealsCreate);
  } catch (e) {
    next(e);
  }
};

const updateMeals = async (req: Request, res: Response) => {
  const id = req.params.id;
  const userId = req.user?.id;

  try {
    const mealsUpdate = await providerServices.updateMeals(
      req.body,
      id as string,
      userId as string,
    );
    res.status(200).json(mealsUpdate);
  } catch (e) {
    res.status(493).json({
      message: "This is not your meal",
    });
  }
};

const deleteMeals = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;

  try {
    const mealsDelete = await providerServices.deleteMeals(id as string);
    res.status(200).json(mealsDelete);
  } catch (e) {
    next(e);
  }
};

export const providerController = {
  createProviderProfile,
  getAllProvider,
  getProviderById,
  getAllMeal,
  getProviderOwnMeals,
  getMealsById,
  createMeals,
  updateMeals,
  deleteMeals,
};
