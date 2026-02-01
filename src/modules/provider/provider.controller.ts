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
const getAllProvider = async (req : Request, res : Response) =>{
    try {
    const mealsCreate = await providerServices.getAllProvider();
    res.status(200).json(mealsCreate);
  } catch (e) {
    res.status(404).json({
      message: "Provider not found",
      error: e,
    });
  }
}
// -------Meals------------
const getAllMeal = async (req: Request, res: Response) => {
  const isAvailable = req.query.isAvailable
    ? req.query.isAvailable === "true"
      ? true
      : req.query.isAvailable === "false"
        ? false
        : undefined
    : undefined;

  try {
    const mealsCreate = await providerServices.getAllMeal(isAvailable as boolean);
    res.status(200).json(mealsCreate);
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

const updateMeals = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;

  try {
    const mealsUpdate = await providerServices.updateMeals(
      req.body,
      id as string,
    );
    res.status(200).json(mealsUpdate);
  } catch (e) {
    next(e);
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
  getAllMeal,
  createMeals,
  updateMeals,
  deleteMeals,
};
